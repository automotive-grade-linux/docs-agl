
May  28,  2015
**2   Architecture**
The  Automotive  Grade  Linux  Software  Architecture  diagram  is  below.  The  architecture  consists
of  five  layers.  The  App/HMI  layer  contains  applications  with  their  associated  business  logic  and
HMI.  Generally  applications  are  out  of  scope  for  this  document  since  they  are  product  specific
for  the  OEM  that  is  developing  a  system  based  on  AGL.
The  Application  Framework  layer  provides  the  APIs  for  creating  both  managing  and  running
applications  on  an  AGL  system.  The  Services  layer  contains  user  space  services  that  all
applications  can  access.  The  Operating  System  (OS)  layer  provides  the  Linux  kernel  and  device
drivers  along  with  standard  OS  utilities.
Page  7  of  159
![](media/picture97.jpeg)![](media/picture98.jpeg)Automotive Grade Linux Requirements Spec v1.0
