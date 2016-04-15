## Python Code for Raspberry Pi
This code is very similar to Version 1 but uses breakbeam sensors instead of avoidance sensors. [Vance Morris](https://github.com/vmorris) kindly consulted on the configuration of the Pi as well as modifications for his original code. We love you Vance!

### table.py

You need the ibmiotf libraries and the RPI.GPIO libraries
```
sudo apt-get install python-dev python-rpi.gpio
```
```
pip install ibmiotf 
```

table.py must reside in /home/pi/my_table for the service file to work
```
sudo mkdir /home/pi/my_table
```

Update the credentials in table.py with your device credentials for the Watson IoT Foundation:
```python
# setup IoT Foundation information
# replace with your credentials
org = "ORG"
type = "table"
id = "ID"
method="token"
token="AUTH-TOKEN"  
```


### pytable.service
To start the python code when the Raspberry Pi starts, add the pytable.service file to /lib/systemd/system 

Update permissions for the file:
```
sudo chmod 644 /lib/systemd/system/pytable.service
```

Configure systemd:
```
sudo systemctl daemon-reload
sudo systemctl enable pytable.service
```

Reboot:
```
sudo reboot
```

Confirm:
```
sudo systemctl status pytable.service
```
