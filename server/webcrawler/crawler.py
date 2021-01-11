import re
from urllib.request import urlopen
from links import linkedin_link_parser, indeed_link_parser
from jobs import linkedin_job_parser, indeed_job_parser

def get_job_links():
  linkedin_url_dict = {
    "102380872": "Boston%2C%20Massachusetts%2C%20United%20States",
    "90000070": "New%20York%20City%20Metropolitan%20Area",
    "104937023": "Philadelphia%2C%20Pennsylvania%2C%20United%20States",
    "101651951": "New%20Jersey%2C%20United%20States"
  }

  indeed_urls = ['New+York,+NY', 'Philadelphia,+PA', 'Boston,+MA']

  job_links = list()
  with open('test.txt', 'w') as f:
    for k,v in linkedin_url_dict.items():
      url = f'https://www.linkedin.com/jobs/search/?f_E=2&geoId={k}&keywords=react%20python%20node&location={v}&redirect=false&position=1&pageNum=0'
      job_links += linkedin_link_parser(url)

    for v in indeed_urls:
      url = f'https://www.indeed.com/jobs?q=react+node+python&l={v}&explvl=entry_level'
      job_links += indeed_link_parser(url)

    joiner = '\n'
    f.write(joiner.join(job_links))
    return job_links