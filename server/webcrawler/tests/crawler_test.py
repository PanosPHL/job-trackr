import pytest
import re
from urllib.request import urlopen
from ..links import linkedin_link_parser, indeed_link_parser
from ..jobs import linkedin_job_parser, indeed_job_parser

@pytest.fixture
def linkedin_job_links():
  return linkedin_link_parser('https://www.linkedin.com/jobs/search/?f_E=2&geoId=102380872&keywords=react%20python%20node&location=Boston%2C%20Massachusetts%2C%20United%20States&redirect=false&position=1&pageNum=0')

def test_linkedin_parser_output_type(linkedin_job_links):
  assert type(linkedin_job_links) == list

def test_linkedin_parser_links(linkedin_job_links):
  link_pattern = re.compile(r'https://www.linkedin.com/jobs/view/.+?trk=public_jobs_job-result-card_result-card_full-click', re.IGNORECASE)

  for job in linkedin_job_links:
    assert link_pattern.search(job) is not None

def test_valid_linkedin_job_links(linkedin_job_links):
  svg_pattern = re.compile(r'<svg id="Artwork')
  for job in linkedin_job_links:
    page = urlopen(job)
    html = page.read().decode("utf-8")
    assert svg_pattern.search(html) is None

@pytest.fixture
def indeed_job_links():
  return indeed_link_parser('https://www.indeed.com/jobs?q=react+node+python&l=New+York,+NY&explvl=entry_level')

def test_indeed_parser_output_type(indeed_job_links):
  assert type(indeed_job_links) == list

def test_indeed_parser_links(indeed_job_links):
  link_pattern = re.compile(r'https://indeed.com/rc/clk\?jk=.*?vjs=.+?', re.IGNORECASE)

  for job in indeed_job_links:
    assert link_pattern.search(job) is not None

def test_valid_indeed_job_links(indeed_job_links):
  table_pattern = re.compile(r'<table class="system_msg"')

  for job in indeed_job_links:
    page = urlopen(job)
    html = page.read().decode("utf-8")
    assert table_pattern.search(html) is None

def test_linkedin_job_content(const_linkedin_job_links, linkedin_parsed_link_results):
  link_pattern = re.compile(r'https://www.linkedin.com/jobs/view/(externalApply/)?')
  job_data = [linkedin_job_parser(link) for link in const_linkedin_job_links]
  for index,job in enumerate(job_data):
    for k in job:
      if k == 'app_link':
        assert link_pattern.search(job[k]) and link_pattern.search(linkedin_parsed_link_results[index][k])
      else:
        assert job[k] == linkedin_parsed_link_results[index][k]

def test_indeed_job_content(const_indeed_job_links, indeed_parsed_link_results):
  link_pattern = re.compile(r'https://(www.)?indeed.com/rc/clk\?jk=.+')
  job_data = [indeed_job_parser(link) for link in const_indeed_job_links]
  for index,job in enumerate(job_data):
    for k in job:
      if k == 'app_link':
        assert link_pattern.search(job[k]) and link_pattern.search(indeed_parsed_link_results[index][k])
      elif k == 'description':
        assert len(job[k]) > 1 and len(indeed_parsed_link_results[index][k]) > 1
      else:
        assert job[k] == indeed_parsed_link_results[index][k]