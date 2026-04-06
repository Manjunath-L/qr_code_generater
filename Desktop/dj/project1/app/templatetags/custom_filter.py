from django import template

register = template.Library()


@register.filter
def sample(value):
    out = ""
    for i in range(len(value)):
        if i % 2 == 0:
            out += value[i].upper()
        else:
            out += value[i].lower()
    return out


@register.filter
def vowels(value):
    res = ""
    for ch in value:
        if ch in "aeiouAEIOU":
            res += ch
    return res


@register.filter
def divisible(value, arg):
    if value % arg == 0:
        return f"{value} is divisible by {arg}"
    else:
        return f"{value} is not divisible by {arg}"


@register.filter
def replace(value, arg):
    old, new = arg.split(",")
    out = ""
    for i in value:
        if i == old:
            out += new
        else:
            out += i
    return out


@register.filter
def reverse_string(value):
    return value[::-1]


@register.filter
def remove_duplicates(value):
    out = ""
    for ch in value:
        if ch not in out:
            out += ch
    return out


@register.filter
def count_words(value):
    words = value.split()
    return len(words)


@register.filter
def is_palindrome(value):
    cleaned = "".join(value.split()).lower()
    return cleaned == cleaned[::-1]
