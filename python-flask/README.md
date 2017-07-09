python-flask
=================

Sample web using Flask for Python.

Trying to hit one of the guides from SnapGuide.

How to run this:

1.  Install all the required modules. To know what modules you need, just go to `python-playground/python-flask/` and run `python python-server.py`. You can also look into `python-server.py` file and see the imports. I used `pip` to install all of the modules. `virtualenv env; pip install -r requirements.txt`

2.  You now you have all the modules installed when you can run `python python-server.py` successfully. It should output something like:

  ```
   * Running on http://127.0.0.1:5000/
   * Restarting with reloader
  ```
3.  Open your browser and hit `localhost:5000`


What this sample app does:

1.  Fetch the json data for this guide: http://snapguide.com/guides/make-confit-byaldi/  (can be changed in the code)
2.  Filter the json data to get data with image metadata in it
3.  For each of data with image metadata in it, create a model of our own
4.  For each model, fetch the actual image from Snapguide (hence the thumbnail view)
5.  On thumbnail image click, fetch the bigger image from Snapguide and save its binary data into our model (for faster navigation later). Then show the big image with `Prev` and `Next` button
6.  Each Guide model has `caption` stored in it. The caption is assigned on thumbnail title.
7.  It's also quite responsive :smile:
8.  Support esc, left arrow, right arrow, and enter keys. Try it out!
