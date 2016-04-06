## Python Code for Raspberry Pi

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
sudo systemctl status pytable.sevice
```
