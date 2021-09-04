from fuzzywuzzy import fuzz
from pypinyin import lazy_pinyin
import jieba
import numpy as np


# for Journal
# 'name', 'ename', 'shortname'
def fuzzy_core_journal(query: str, values: list[str]) -> float:
    name, ename, shortname = values
    ename, shortname, query = \
        ename.lower() if ename else None, \
        shortname.lower() if shortname else None, \
        query.lower() if query else None
    name_pinyin = ' '.join(lazy_pinyin(name)) if name else None
    org_score = [fuzz.ratio(query, name), fuzz.partial_ratio(query, ename),
                 fuzz.ratio(query, shortname), fuzz.partial_ratio(lazy_pinyin(query), name_pinyin)]
    score = list(map(lambda x: min(100, 101-x)/100, org_score))
    return float(np.prod(score))


# for Author
# 'firstname', 'lastname', 'alter_firstname', 'alter_lastname', 'author_id'
def fuzzy_core_author(query: str, values: list[str]) -> float:
    firstname, lastname, alter_firstname, alter_lastname, author_id = values
    firstname, lastname, query = \
        firstname.lower() if firstname else None, \
        lastname.lower() if lastname else None, \
        query.lower() if query else None
    fullname = ' '.join([firstname if firstname else '', lastname if lastname else ''])
    alter_fullname = ''.join([alter_lastname if alter_lastname else '',
                              alter_firstname if alter_firstname else ''])
    fullname = fullname if fullname else None
    alter_fullname = alter_fullname if alter_fullname else None
    org_score = [fuzz.ratio(query, firstname), fuzz.ratio(query, lastname),
                 fuzz.ratio(query, alter_firstname), fuzz.ratio(query, alter_lastname),
                 fuzz.ratio(query, alter_fullname), fuzz.partial_ratio(lazy_pinyin(query), fullname),
                 fuzz.ratio(query, author_id)]
    score = list(map(lambda x: min(100, 101-x)/100, org_score))
    return float(np.prod(score))


# for Keyword / Topic
# 'name'
def fuzzy_core_short(query: str, values: list[str]) -> float:
    name, = values
    name_pinyin = ' '.join(lazy_pinyin(name)) if name else None
    org_score = [fuzz.ratio(query, name), fuzz.partial_ratio(lazy_pinyin(query), name_pinyin)]
    score = list(map(lambda x: min(100, 101-x)/100, org_score))
    return float(np.prod(score))


# for Project / TJC_title
# 'name'
def fuzzy_core_long(query: str, values: list[str]) -> float:
    name, = values
    name_pinyin = ' '.join(lazy_pinyin(name)) if name else None
    div_name = ' '.join(jieba.lcut(name))
    div_query = ' '.join(jieba.lcut(query))
    org_score = [fuzz.ratio(query, name), fuzz.partial_ratio(lazy_pinyin(query), name_pinyin),
                 fuzz.partial_ratio(div_query, div_name)]
    score = list(map(lambda x: min(100, 101-x)/100, org_score))
    return float(np.prod(score))


# for TJC
# 'title', 'intro', 'tjc_id', 'keyword(nesting)', 'author(nesting)'
def fuzzy_core_tjc(query: str, values: list[str]) -> float:
    title, intro, tjc_id, keyword_list, author_list = values
    title_pinyin = ' '.join(lazy_pinyin(title)) if title else None
    query_pinyin = ' '.join(lazy_pinyin(query))
    div_title = ' '.join(jieba.lcut_for_search(title))
    div_intro = ' '.join(jieba.lcut_for_search(intro))
    div_query = ' '.join(jieba.lcut(query))
    org_score = [
        fuzz.ratio(query, title),
        fuzz.partial_ratio(div_query, div_title),
        fuzz.partial_ratio(query_pinyin, title_pinyin),
        fuzz.partial_ratio(div_query, div_intro),
        fuzz.ratio(query, tjc_id),
    ]
    score = [
        *list(map(lambda x: min(100, 101-x)/100, org_score)),
        *list(map(lambda x: fuzzy_core_short(query, x), keyword_list)),
        *list(map(lambda x: fuzzy_core_author(query, x), author_list))
    ]
    return float(np.prod(score))


def fuzzy_search(query: str, search_list: list[tuple], method=fuzzy_core_journal) -> list[tuple]:
    if len(search_list) == 0:
        return []
    if len(search_list) == 1:
        pk, *values = search_list[0]
        return [(pk, method(query, values))]
    length = len(search_list)
    left = fuzzy_search(query, search_list[:length//2], method)
    right = fuzzy_search(query, search_list[length // 2:], method)
    return left + right


