from fuzzywuzzy import fuzz
from pypinyin import lazy_pinyin
import jieba
import numpy as np


# for Journal
# 'name', 'ename', 'shortname'
def fuzzy_core_journal(query: str, values: list[str]) -> float:
    name, ename, shortname = values
    ename, shortname, query = ename.lower(), shortname.lower(), query.lower()
    name_pinyin = ' '.join(lazy_pinyin(name)) if name else None
    org_score = [fuzz.ratio(query, name), fuzz.partial_ratio(query, ename),
                 fuzz.ratio(query, shortname), fuzz.partial_ratio(lazy_pinyin(query), name_pinyin)]
    score = list(map(lambda x: min(100, 101-x)/100, org_score))
    return float(np.prod(score))


# for Keyword / Topic / Author
# 'name'
def fuzzy_core_short(query: str, values: list[str]) -> float:
    name, = values
    name_pinyin = ' '.join(lazy_pinyin(name)) if name else None
    org_score = [fuzz.ratio(query, name), fuzz.partial_ratio(lazy_pinyin(query), name_pinyin)]
    score = list(map(lambda x: min(100, 101-x)/100, org_score))
    return float(np.prod(score))


def fuzzy_search(query: str, search_list: list[tuple], method=fuzzy_core_journal) -> list[tuple]:
    if len(search_list) == 0:
        return []
    if len(search_list) == 1:
        pk, *values = search_list[0]
        return [(pk, method(query, values))]
    length = len(search_list)
    left = fuzzy_search(query, search_list[:length//2])
    right = fuzzy_search(query, search_list[length // 2:])
    return left + right


