import re
from urllib.request import urlopen

def linkedin_link_parser(url):
  page = urlopen(url)
  html = page.read().decode("utf-8")
  links = re.findall(r'https://www.linkedin.com/jobs/view/.+?trk=public_jobs_job-result-card_result-card_full-click', html, re.IGNORECASE)
  return links

def indeed_link_parser(url):
  page = urlopen(url)
  html = page.read().decode("utf-8")
  links = re.findall(r'rc/clk\?jk=.*?vjs=.+?', html, re.IGNORECASE)
  final_links = map(lambda path_name: f"https://indeed.com/{path_name}", links)
  return list(final_links)