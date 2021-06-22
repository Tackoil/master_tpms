import re

from django.db import models
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
import random
import string

be_selected = string.ascii_letters + string.digits


def get_random_string():
    return "".join(random.sample(be_selected, 10)).lower()


def un_camelize(camelCaps, separator="_"):
    pattern = re.compile(r'((?<!^)[A-Z]{1})')
    sub = re.sub(pattern, separator+r'\1', camelCaps).lower()
    return sub


# Create your models here.
class BaseModel(models.Model):
    _id = models.CharField(max_length=10, primary_key=True)

    own_field = []
    many_many_field = {}
    many_one_field = {}
    one_many_field = []
    one_one_field = []

    class Meta:
        abstract = True

    @classmethod
    def load_from_json(cls, data, parent=None, skip_none=False):
        print(data)
        new_object = []
        try:
            if "pk" in data.keys() and data["pk"][0] != '_':
                obj = cls.objects.get(pk=data["pk"])
            else:
                obj = cls(pk=get_random_string())
                obj.save()
                new_object.append(obj)
            for key in obj.own_field:
                if not skip_none or key in data.keys():
                    setattr(obj, key, data.get(key))
            for key in obj.many_many_field:
                obj2_list = []
                for value in data.get(key, []):
                    obj2, new_obj = globals()[obj.many_many_field[key]].load_from_json(value, skip_none=True)
                    obj2_list.append(obj2)
                    new_object.extend(new_obj)
                if skip_none:
                    for obj2 in obj2_list:
                        getattr(obj, key).add(obj2)
                else:
                    getattr(obj, key).set(obj2_list)
            for key in obj.many_one_field:
                if key in data.keys():
                    obj2, new_obj = globals()[obj.many_one_field[key]].load_from_json(data[key], skip_none=True)
                    setattr(obj, key, obj2)
                    new_object.extend(new_obj)
                elif not skip_none:
                    setattr(obj, key, None)
            if parent:
                setattr(obj, parent[0], parent[1])
            obj.save()
            for is_choice, para in obj.one_many_field:
                if is_choice:
                    indicator, choice, name = para
                    child_class_name, foreign = choice[getattr(obj, indicator)]
                else:
                    child_class_name, foreign = para
                    name = un_camelize(child_class_name)
                child_class = globals()[child_class_name]
                history_dict = {
                    i.pk: child_class.objects.get(pk=i.pk)
                    for i in child_class.objects.filter(**{foreign: obj.pk})
                }
                for item in data.get(name, []):
                    _, new_obj = child_class.load_from_json(item, parent=(foreign, obj), skip_none=True)
                    new_object.extend(new_obj)
                    if _.pk in history_dict:
                        history_dict.pop(_.pk)
                if not skip_none:
                    for unused_history in history_dict:
                        history_dict[unused_history].delete()
            for is_choice, para in obj.one_one_field:
                if is_choice:
                    indicator, choice, name = para
                    child_class_name, foreign = choice[getattr(obj, indicator)]
                else:
                    child_class_name, foreign = para
                    name = un_camelize(child_class_name)
                child_class = globals()[child_class_name]
                if name in data.keys():
                    _, new_obj = child_class.load_from_json(data[name], parent=(foreign, obj), skip_none=True)
                    new_object.extend(new_obj)
                elif not skip_none:
                    child_class.objects.get(**{foreign: obj.pk}).delete()
            return obj, new_object
        except (AssertionError, ObjectDoesNotExist, MultipleObjectsReturned) as e:
            print(e)
            if new_object:
                for item in new_object:
                    item.delete()
            assert False, "Loading from JSON error: {}".format(e)
        except Exception as e:
            if new_object:
                for item in new_object:
                    item.delete()
            raise e

    def export_to_json(self, value=None):
        data = {"pk": self.pk}
        for key in self.own_field:
            if not value or key in value.keys():
                data[key] = getattr(self, key)
        for key in self.many_many_field:
            if not value or key in value.keys():
                data[key] = []
                for item in getattr(self, key).all():
                    data[key].append(item.export_to_json(value.get(key) if value else None))
        for key in self.many_one_field:
            if not value or key in value.keys():
                data[key] = getattr(self, key).export_to_json(value.get(key) if value else None) \
                    if getattr(self, key) else None
        for is_choice, para in self.one_many_field:
            if is_choice:
                indicator, choice, name = para
                child_class_name, foreign = choice[getattr(self, indicator)]
            else:
                child_class_name, foreign = para
                name = un_camelize(child_class_name)
            if not value or name in value.keys():
                child_class = globals()[child_class_name]
                child_objs = child_class.objects.filter(**{foreign: self.pk})
                data[name] = []
                for child in child_objs:
                    data[name].append(child.export_to_json(value.get(name) if value else None))
        for is_choice, para in self.one_one_field:
            if is_choice:
                indicator, choice, name = para
                child_class_name, foreign = choice[getattr(self, indicator)]
            else:
                child_class_name, foreign = para
                name = un_camelize(child_class_name)
            if not value or name in value.keys():
                child_class = globals()[child_class_name]
                child_obj = child_class.objects.get(**{foreign: self.pk})
                data[name] = child_obj.export_to_json(value.get(name) if value else None)
        return data


class Rating(BaseModel):
    name = models.CharField(max_length=20)
    rate = models.CharField(max_length=20)

    own_field = ['name', 'rate']

    class Meta:
        unique_together = ("name", "rate")


class JC(BaseModel):
    jc_id = models.CharField(max_length=50, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    ename = models.CharField(max_length=100, blank=True, null=True)
    shortname = models.CharField(max_length=20, blank=True, null=True)
    type = models.CharField(max_length=5, choices=[('j', 'journal'), ('c', 'conference')])
    rate = models.ManyToManyField(Rating)

    own_field = ['name', 'jc_id', 'ename', 'shortname', 'type']
    many_many_field = {"rate": "Rating"}
    one_many_field = [
        (
            True,
            ('type', {'j': ("JournalHistory", "whose"), 'c': ("ConferenceHistory", "whose")}, 'history')
        )
    ]


class JournalHistory(BaseModel):
    y = models.IntegerField(default=-1)
    v = models.IntegerField(default=-1)
    n = models.IntegerField(default=-1)
    cover = models.URLField(blank=True, null=True)
    whose = models.ForeignKey(JC, blank=True, null=True, on_delete=models.CASCADE)

    own_field = ['y', 'v', 'n', 'cover', 'whose_id']

    class Meta:
        unique_together = ("y", "v", "n", "whose")


class ConferenceHistory(BaseModel):
    year = models.IntegerField(default=-1)
    call_date = models.BigIntegerField(blank=True, null=True)
    pub_date = models.BigIntegerField(blank=True, null=True)
    con_date = models.BigIntegerField(blank=True, null=True)
    place = models.CharField(max_length=100, blank=True, null=True)
    whose = models.ForeignKey(JC, blank=True, null=True, on_delete=models.CASCADE)

    own_field = ['year', 'call_date', 'pub_date', 'con_date', 'place', 'whose_id']

    class Meta:
        unique_together = ("year", "whose")


class Author(BaseModel):
    author_id = models.CharField(max_length=20, blank=True, null=True)
    first_name = models.CharField(max_length=20, blank=True, null=True)
    last_name = models.CharField(max_length=20, blank=True, null=True)
    alter_first_name = models.CharField(max_length=20, blank=True, null=True)
    alter_last_name = models.CharField(max_length=20, blank=True, null=True)
    is_student = models.BooleanField(default=True)
    named_mentor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, related_name="named")
    proj_mentor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, related_name="proj")
    in_grade = models.IntegerField(default=-1, blank=True, null=True)
    out_grade = models.IntegerField(blank=True, null=True)

    own_field = ['author_id', 'first_name', 'last_name', 'alter_first_name', 'alter_last_name',
                 'is_student', 'in_grade', 'out_grade']
    many_one_field = {"named_mentor": "Author", "proj_mentor": "Author"}


class Topic(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    own_field = ["name"]


class Keyword(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    own_field = ["name"]


class Project(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    url = models.URLField(blank=True, null=True)
    own_field = ["name", "url"]


class TJC(BaseModel):
    tjc_id = models.CharField(max_length=50, blank=True, null=True)
    tjc = models.CharField(max_length=5, choices=[('t', 'thesis'), ('j', 'journal_paper'), ('c', 'conference_paper')])
    title = models.CharField(max_length=100, blank=True, null=True)
    date = models.BigIntegerField(blank=True, null=True)
    is_favor = models.BooleanField(default=False)
    topic = models.ManyToManyField(Topic)
    keyword = models.ManyToManyField(Keyword)
    intro = models.CharField(max_length=500, blank=True, null=True)
    project = models.ManyToManyField(Project)

    own_field = ["tjc_id", "title", "date", "is_favor", "intro", "tjc"]
    many_many_field = {"topic": "Topic", "keyword": "Keyword", "project": "Project"}
    one_many_field = [
        (False, ("Authors", "tjc"))
    ]
    one_one_field = [
        (
            True,
            ('tjc', {
                't': ("Thesis", "whose"),
                'j': ("JournalPaper", "whose"),
                'c': ("ConferencePaper", "whose")
            }, 'detail')
        )
    ]


class Authors(BaseModel):
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True)
    tjc = models.ForeignKey(TJC, on_delete=models.CASCADE, null=True)
    author_order = models.IntegerField(default=-1)

    own_field = ["author_order"]
    many_one_field = {"author": "Author"}

    class Meta:
        ordering = ('author_order',)


class ThesisType(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    own_field = ["name"]


class Thesis(BaseModel):
    rate = models.FloatField(blank=True, null=True)
    type = models.ForeignKey(ThesisType, on_delete=models.SET_NULL, null=True)
    full_path = models.URLField(blank=True, null=True)
    ppt_path = models.URLField(blank=True, null=True)
    whose = models.ForeignKey(TJC, on_delete=models.CASCADE, unique=True, blank=True, null=True)

    own_field = ["rate", "full_path", "ppt_path"]
    many_one_field = {"type": "ThesisType"}


class JournalPaper(BaseModel):
    com_author = models.ManyToManyField(Author)
    journal = models.ForeignKey(JC, on_delete=models.SET_NULL,  null=True)
    journal_history = models.ForeignKey(JournalHistory, on_delete=models.SET_NULL, null=True)
    page = models.IntegerField(blank=True, null=True)
    is_induct = models.BooleanField(default=False)
    is_gov = models.BooleanField(default=False)
    is_inter = models.BooleanField(default=False)
    is_kua = models.BooleanField(default=False)
    inter = models.BooleanField(default=False)
    full_path = models.URLField(blank=True, null=True)
    home_path = models.URLField(blank=True, null=True)
    whose = models.ForeignKey(TJC, on_delete=models.CASCADE, unique=True, blank=True, null=True)

    own_field = ["page", "is_induct", "is_gov", "is_inter", "is_kua", "inter", "full_path", "home_path"]
    many_many_field = {"com_author": "Author"}
    many_one_field = {"journal": "JC", "journal_history": "JournalHistory"}


class ConferencePaper(BaseModel):
    com_author = models.ManyToManyField(Author)
    conference = models.ForeignKey(JC, on_delete=models.SET_NULL, null=True)
    conference_history = models.ForeignKey(ConferenceHistory, on_delete=models.SET_NULL, null=True)
    page = models.IntegerField(blank=True, null=True)
    is_induct = models.BooleanField(default=False)
    is_gov = models.BooleanField(default=False)
    is_inter = models.BooleanField(default=False)
    is_kua = models.BooleanField(default=False)
    inter = models.BooleanField(default=False)
    full_path = models.URLField(blank=True, null=True)
    whose = models.ForeignKey(TJC, on_delete=models.CASCADE, unique=True, blank=True, null=True)

    own_field = ["page", "is_induct", "is_gov", "is_inter", "is_kua", "inter", "full_path"]
    many_many_field = {"com_author": "Author"}
    many_one_field = {"conference": "JC", 'conference_history': "ConferenceHistory"}




