import re
from urllib.request import urlopen

def linkedin_job_parser(url):
  page = urlopen(url)
  html = page.read().decode("utf-8")
  pattern = re.compile(r'(<section class="topcard".+</section><section class="description">.+</section>)<section class="find')

  # Get job info

  job_content = pattern.search(html)
  job_content = job_content[0]

  job_title_pattern = re.compile(r'<h1 class="topcard__title">(.+?)</h1>')
  job_title_content = job_title_pattern.search(job_content)

  company_pattern = re.compile(r'<a class="topcard__org-name-link.+?>(.+?)</a>')
  company_content = company_pattern.search(job_content)

  location_pattern = re.compile(r'<span class="topcard__flavor topcard__flavor--bullet">(.+?)</span>')
  location_content = location_pattern.search(job_content)

  external_app_link_pattern = re.compile(r'<a.+?data-is-offsite-apply="true".+?href="(.+?)".+?>')
  external_app_link_content = external_app_link_pattern.search(job_content)

  # Get job description for iframe
  description_div_pattern = re.compile(r'<div.+?class="show-more-less-html__markup.+?>(.+?)</div><button class="show-more-less-html')
  description_div_content = description_div_pattern.search(html)

  return {
    "title": job_title_content[1],
    "company": company_content[1],
    "location": location_content[1],
    "app_link": url if external_app_link_content is None else external_app_link_content[1],
    "description_content": description_div_content[1]
  }

print(linkedin_job_parser('https://www.linkedin.com/jobs/view/software-engineer-i-at-root-inc-2360916456?refId=58341994-8aee-4bd9-975c-e2d608d3b4ba&trackingId=6gx4VqavDaJ78X4oFLghKg%3D%3D&trk=public_jobs_topcard_title'))

def indeed_job_parser(url):
  page = urlopen(url)
  html = page.read().decode("utf-8")
  start = html.find('role="main"')
  end = html.find('id="relatedLinks"')
  body = html[start:end]

  job_title_pattern = re.compile(r'<h1 class=".+?jobsearch-JobInfoHeader-title">(.+?)</h1>', re.IGNORECASE)
  job_title_content = job_title_pattern.search(body)

  company_pattern = re.compile(r'<div class="jobsearch-InlineCompanyRating.+?>(<div.+?>.+?</div>).+</div>')
  company_content = company_pattern.search(body)

  company_name = None
  nested_company_pattern = re.compile(r'<.+?>([a-zA-Z1-9,\s]+?)</.+?>')

  if company_content[1].find('<a') != -1 or nested_company_pattern.search(company_content[1]) is not None:
    company_name = nested_company_pattern.search(company_content[1])[1]

  location_pattern = re.compile(r'<div>([A-Za-z\d\s,1-9]+)<\/div>', re.IGNORECASE)
  location_content = location_pattern.search(company_content[0])

  app_link_pattern = re.compile(r'href="(https://www.indeed.com/rc/.+?)"')
  app_link_content = app_link_pattern.search(body)

  description_start = body.find('<div class="jobsearch-JobComponent-description')
  description_end = body.find('<div id="mosaic-belowFullJobDescription"')

  return {
    "title": job_title_content[1],
    "company": company_name if company_name is not None else company_content[1],
    "location": location_content[1],
    "app_link": app_link_content[1] if app_link_content else url,
    "description": body[description_start:description_end]
  }