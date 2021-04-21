from django.db import models


# Create your models here.
class BaseModel(models.Model):
    all_field = []
    all_other_field = {}

    class Meta:
        abstract = True

    @classmethod
    def load_from_json(cls, data):
        if "pk" in data.keys():
            obj = cls.objects.get(pk=data["pk"])
        else:
            obj = cls()
            obj.save()
        for key in obj.all_field:
            setattr(obj, key, data.get(key))
        for key in obj.all_other_field:
            for value in data.get(key, []):
                obj2 = obj.all_other_field[key].load_from_json(value)
                getattr(obj, key).add(obj2)
        obj.save()
        return obj

    def export_to_json(self, value=None):
        data = {"pk": self.pk}
        for key in self.all_field:
            if value is None or key in value.keys():
                data[key] = getattr(self, key)
        for key in self.all_other_field:
            if not value or key in value.keys():
                data[key] = []
                for item in getattr(self, key).all():
                    data[key].append(item.export_to_json(value.get(key) if value else None))
        return data


class JournalRating(BaseModel):
    name = models.CharField(max_length=20)
    rate = models.CharField(max_length=20)

    all_field = ['name', 'rate']

    class Meta:
        unique_together = ("name", "rate")


class Journal(BaseModel):
    name = models.CharField(max_length=100, blank=True, null=True)
    ename = models.CharField(max_length=100, blank=True, null=True)
    shortname = models.CharField(max_length=20, blank=True, null=True)
    deadline = models.BigIntegerField(blank=True, null=True)
    publish = models.BigIntegerField(blank=True, null=True)
    rate = models.ManyToManyField(JournalRating)

    all_field = ['name', 'ename', 'shortname', 'deadline', 'publish']
    all_other_field = {'rate': JournalRating}







