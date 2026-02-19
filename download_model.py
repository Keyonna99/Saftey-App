import urllib.request

url = "https://github.com/chuanqi305/MobileNet-SSD/raw/master/mobilenet_iter_73000.caffemodel"
output = "models/mobilenet_iter_73000.caffemodel"

print("Downloading model...")
urllib.request.urlretrieve(url, output)
print("Download complete!")
