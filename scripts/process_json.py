import json
import os

file_path = f"{os.getcwd()}/_data/links.json"

with open(file_path, "r", encoding="utf-8") as file:
    data = json.load(file)


def get_name_display_name_mapping(data_list):
    return {item["name"]: item["displayName"] for item in data_list}


name_display_name_dict = get_name_display_name_mapping(data)
for name, display_name in name_display_name_dict.items():
    print(f"{name}: {display_name}")
