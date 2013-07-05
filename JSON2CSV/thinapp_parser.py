#!/usr/bin/python

import json
import csv
import datetime
import cStringIO
import codecs


def main():
	f = open('/home/administrator/Documents/code/sandbox/python/lxml.html/ThinApp/thinapp.json', 'rb')
	json_data = f.read()
	data = json.loads(json_data)
	f.close()

	n = datetime.datetime.now()

	with open('/home/administrator/Documents/code/sandbox/python/lxml.html/ThinApp/thinapp.csv', 'wb') as csvfile:
		writer = CSVUnicodeWriter(csvfile)
		writer.writerow(['Views', 'Title', 'Date'])
		a = 0

		for element in data:
			p = datetime.datetime.strptime(element['date'], "%B %d, %Y %I:%M %p")
			date = n - p
			writer.writerow([str(element['views']), unicode(element['title']), str(date.days)])
			a += 1


class CSVUnicodeWriter: # http://docs.python.org/library/csv.html
	"""
	A CSV writer which will write rows to CSV file "f",
	which is encoded in the given encoding.
	"""

	def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
		# Redirect output to a queue
		self.queue = cStringIO.StringIO()
		self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
		self.stream = f
		self.encoder = codecs.getincrementalencoder(encoding)()
		f.write('\xEF\xBB\xBF')

	def writerow(self, row):
		self.writer.writerow([s.encode("utf-8") for s in row])
		# Fetch UTF-8 output from the queue ...
		data = self.queue.getvalue()
		data = data.decode("utf-8")
		# ... and reencode it into the target encoding
		data = self.encoder.encode(data)
		# write to the target stream
		self.stream.write(data)
		# empty queue
		self.queue.truncate(0)

	def writerows(self, rows):
		for row in rows:
			self.writerow(row)


if __name__ == '__main__':
	main()
