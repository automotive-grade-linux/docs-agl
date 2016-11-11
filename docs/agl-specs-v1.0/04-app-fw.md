---

title : Application Framwork
author: imported from Doors-ng by Fulup(iot.bzh)
date  : 2016-06-30
categories: architecture, automotive
tags: architecture, automotive, linux
layout: techdoc 
 
---

## Application   Framework   Layer
The  Application  Framework  layer  provides  the  methods  needed  to  create  software  applications
and  their  user  interfaces.  The  platform  can  support  multiple  application  frameworks  any  of
which  may  be  built  into  an  SDK  or  product  build.  The  application  framework  contains  any  code
specifically  written  for  that  framework  as  well  the  bindings  to  the  Services  and  Operating
Systems  layers  that  the  application  framework  provides  for  its  applications.
4.1  AGL  Application  Framework
The  AGL  Application  Framework  provides  basic  services  to  all  applications  regardless  of  the
framework  they  are  implemented  in  so  that  there  is  a  standard  method  providing  the  services.
Page  20  of  159

Automotive Grade Linux Requirements Spec v1.0 ![](../media/picture114.jpeg)
{: class="image"}

May  28,  2015

### Application  Manager
Application  Manager  describes  requirements  for  AGL  application  lifecycle  function.  Application
lifecycle  contains  application  installation/removal  and  launch/hide/resume/kill.

### Requirements
AGL  System  must  support  application  lifecycle  (install/uninstall,  launch/kill,  suspend/resume)  based  on
appid/pid  via  launcher.
AGL  System  must  support  a  database  to  store  application  metadata  (appid,  exec  path  etc.).
AGL  System  must  provide  an  interface  to  get  a  list  of  installed  applications.
AGL  System  must  provide  an  interface  to  get  the  state  of  an  application.
AGL  System  must  provide  application  privilege  control.

### Window  Manager
A  window  system  is  a  software  component  that  facilitates  an  implementation  of  graphical  user  interface.  A
window  system  is  responsible  for  managing  display  devices,  Graphics  Processing  Units  (GPUs),  input
devices,  and  graphics  memory.  A  window  system  works  with  the  software  component  named  window
manager  that  is  responsible  for  a  layout  management  of  windows,  and  a  routing  of  user  interactions.
A  window  manager  is  as  software  component  that  is  responsible  for  a  layout  management  of
windows.
Window  manager  of  automotive  middleware  layer  makes  up  for  traditional  window  management
system  to  be  satisfied  IVI’s  complex  requirements,  typically  requested  from  Policy  Manager.
Also,  AGL  aims  to  provide  well-portability  among  various  hardware  platforms.
Page  21  of  159

   **No.**   | **Role**                    | **Description**
  -----------| -----------------------------|--------------------------------------------------------------
   1         | Window  drawing             | Provide  capability  to  draw  a  window  to  any  place
             |                               |
             |                               | and  any  size  and  any  scale.
             |                               |
             |                               | Also  provide  capability  to  change  visibility  of  the
             |                               |
             |                               | window. 
   2         | Overlay  of  multiple       | Provide  capability  to  overlay  two  or  more  windows
             |                             |
             | windows                     | with  any  z-order.
             |                              |
             |                               | Also  provide  capability  to  use  hardware  layer
             |                               |
             |                               | efficiently.
   3         | Visual  effect              | Provide  capability  to  adapt  visual  effect  as  below.
             |                              |
             |                              | ·     Animation  effect  to  change  visibility
             |                              |
             |                              | ·     Animation  effect  to  transit  between  two  or
             |                              |
             |                              | more  windows
             |                              |
             |                              | ·     Visual  effect  for  a  window,  such  as  gray-out
             |                              |
             |                              | and  transparent.
   4         | Frame  rate  control        | Provide  capability  to  control  dynamic  frame  rate
             |                              |
             |                              | change.  This  is  useful  if  system  resource  was
             |                              |
             |                              | shortage.
   5         | Multiple  hardware  layer   | Provide  capability  to  use  hardware  layer  efficiently
             |                             |
             | support                     | if  hardware  supports  two  or  more  hardware  layers.
  
![](media/picture115.jpeg)Automotive Grade Linux Requirements Spec v1.0

May  28,  2015

#### Use Case
Please  refer  “screen  resource  control”  of  Policy  Manger  section.

#### Role
Table  7-148  describes  the  role  of  window  manager  to  be  satisfied  above  purpose  and  use
cases.
Page  22  of  159

  ----------------------------------------------------------------------------------------------
  | 6   | Reduced  dependency  of   | Provide  well-defined  interface  to  reduce
        |                           |
        | hardware                  | dependency  of  hardware.  Well-defined  interface
                                    |
                                    | also  makes  it  possible  to  increase  the  effect  of
                                    |
                                    | portability  and  development  cost.
  ----- --------------------------- ------------------------------------------------------------
  | 7   | Multi  window  /  multi   | Support  multi  window  management  and  multi
        |                           |
        | display                   | display.

  | 8   | Compatibility             | From  the  compatibility  point  of  view,  AGL  should
                                    |
                                    | use  public  API,  and  shall  not  rely  on  hardware
                                    |
                                    | specific  API.
  ----------------------------------------------------------------------------------------------

![](media/picture116.jpeg)Automotive Grade Linux Requirements Spec v1.0

May  28,  2015
#### Requirements
4.1.2.3.1  Window  Drawing
System  must  provide  a  mechanism  to  manage  surfaces,  such  as  create,  delete,  make  visible  and
make  invisible.
System  must  provide  a  mechanism  to  create  and  delete  surface.
When  surface  is  created  or  deleted,  system  must  notify  status  change  to  GUI  resource.
This  notification  mechanism  makes  possible  to  assign  surface  to  proper  area  by  GUI  resource.
System  must  provide  a  mechanism  to  change  visibility  per  each  surface.
And,  provide  an  interface  to  change  visibility.
All  the  surfaces  must  be  set  to  invisible  for  initial  state.
Surface  will  be  visible  only  if  GUI  resource  issues  to  change  visibility.
System  must  provide  a  mechanism  to  move  surface’s  area.  If  area  size  was  different  between
previous  area  and  new  one,  then  system  must  support  to  fit  into  new  area  by  VIC.4.1.4.
*System must provide a mechanism to fit surface into area. Because, size of area may differe*nt
Page  23  of  159
![](media/picture117.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
from  size  of  surface.
If  resize  was  happened,  system  must  notify  to  surface’s  owner  application.
If  size  of  surface  and  size  of  area  was  different,  system  must  provide  a  mechanism  to  fit  surface
into  area  by  squeeze.
If  size  of  surface  and  size  of  area  was  different,  system  must  provide  a  mechanism  to  fit  surface
into  area  by  using  combination  of  scaling  and  trimming  function.
That  means,  system  must  provide  a  mechanism  to  fit  surface  into  area  keeping  original  aspect
ratio.  This  makes  it  possible  to  fit  by  “pan  &  scan”.
If  size  of  surface  and  size  of  area  was  different,  system  must  provide  a  mechanism  to  fit  surface
into  area  by  using  combination  of  scaling  and  background  color.
That  means,  system  must  provide  a  mechanism  to  fit  surface  into  area  keeping  original  aspect
ratio.  System  also  provides  a  mechanism  to  fill  background  color  into  redundant  pixels.  This
mechanism  makes  it  possible  to  do  “letterbox”  method.
4.1.2.3.2  Overlay  of  Multiple  Windows
System  must  provide  a  mechanism  to  create  and  delete  a  layer.
Layer  must  have  a  concept  of  z-order.  That  means,  display  order  for  each  layer  is  decided  by
their  z-order  attribute.
Z-order  attribute  is  fixed  value.  So,  if  application  wants  to  change  display  order  of  surfaces,
then,  attached  layer  must  be  changed.
System  must  provide  a  mechanism  to  create  and  delete  “area”  to  display  surface.
Area  is  a  concept  which  defines  where  to  display  in  specific  layer.
System  must  provide  a  mechanism  to  attach  surface  to  any  layer.
Also,  system  must  be  able  to  change  attached  layer.
And,  provide  an  interface  to  attach  and  change.
Page  24  of  159
![](media/picture118.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
System  must  provide  a  mechanism  to  assign  surface  to  any  area  in  a  layer.
And,  provide  an  interface  to  assign  surface  to  any  area.
System  must  provide  a  mechanism  to  change  visibility  per  each  layer.
That  means  all  the  surfaces  belonging  to  same  layer  will  be  changed  visible  or  invisible  at  the
same  time.
And,  provide  an  interface  to  change  visibility  per  layer.
Initial  state  must  be  set  to  invisible.
System  must  provide  a  mechanism  to  enable  superimposed  display  based  on  z-order  of  each
layer,  and  disposition  of  surfaces.
4.1.2.3.3  Visual  Affect
System  must  provide  a  mechanism  to  apply  animation  effect  when  visibility  change  was
happened.
Per  each  animation,  system  must  provide  a  mechanism  to  apply  below  attributes.
- Duration
Animation  type
System  must  provide  typical  animation  effects,  such  as  slide-in,  slide-out,  zoom-in  and  zoom-
out.
Also,  system  must  provide  a  mechanism  to  add,  delete  and  change  animation  effect  easily  by
plug-in  architecture.
System  must  provide  a  mechanism  to  apply  animation  effect  when  move  surface  was  happened.
Per  each  animation,  system  must  provide  a  mechanism  to  apply  below  attributes.
· Duration
Animation  type
System  must  provide  typical  animation  effects,  such  as  slide-in,  slide-out,  zoom-in  and  zoom-
Page  25  of  159
![](media/picture119.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
out.
Also,  system  must  provide  a  mechanism  to  add,  delete  and  change  animation  effect  easily  by
plug-in  architecture.
System  must  provide  a  mechanism  to  make  effect  to  surface.
And,  provide  an  interface  to  set  effect  type  from  application  and  other  software  components.
System  must  provide  a  mechanism  to  make  specific  surface  to  gray-out.
System  must  provide  a  mechanism  to  make  specific  surface  to  low  brightness
System  must  provide  a  mechanism  to  add,  delete  and  change  effect  for  surface  easily  by  plug-in
architecture.
4.1.2.3.4  Frame  Rate  Control
System  must  provide  a  mechanism  to  reduce  frame  rate  independent  from  refresh  interval  of
application.
System  also  provides  a  mechanism  to  set  frame  rate  as  0fps,  independent  from  refresh  interval
of  application.
This  function  is  useful  to  keep  whole  system  quality  even  if  high  load  status,  such  as  live
thumbnail  and  moving  surface.
4.1.2.3.5  Multiple  Hardware  Layer  Support
If  hardware  supports  two  or  more  hardware  layers,  system  must  provide  a  mechanism  to  use
hardware  layers  efficiently.
·
Never  use  software  overlay  when  superimposing  two  or  more  hardware  layers
Assign  hardware  layer  for  graphical  high  load  function,  such  as  video  playback
4.1.2.3.6  Reduced  Dependency  of  Hardware
Page  26  of  159
![](media/picture120.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Window  Manager  must  be  able  to  retrieve  system  structure  regarding  displays  and  layers  of
each  display.  And  system  must  provide  a  mechanism  to  adapt  any  structure  without  re-build,
such  as  by  using  re-configuration.
4.1.2.3.7  Multi  Window
AGL  specifies  that  automotive  grade  Linux  shall  manage  multiple  windows  owned  by  multiple
processes  on  a  display.
AGL  specifies  that  automotive  grade  Linux  shall  support  multi-headed  display.
4.1.2.3.8  Compatibility
AGL  specifies  that  automotive  grade  Linux  shall  have  a  window  manager  that  uses  only  public
APIs  provided  by  Window  System  and  OpenGL/ES  2.0  for  rendering  and  user  interaction.
AGL  specifies  that  automotive  grade  Linux  shall  have  a  window  manager  that  relies  on  a
standard  rendering  API  such  as  OpenGL/ES  2.0  only.  The  window  manager  shall  not  rely  on  any
hardware  specific  API.
A  window  system  and  OpenGL/ES  2.0  API  are  responsible  for  a  hardware  abstraction.

**4.1.3  Policy  Manager**
**4.1.3.1  Overview**
4.1.3.1.1  Purpose
Policy  Manager  collects  information  and  makes  decisions  based  on  them.  To  do  that,  Policy
Manager  collects  lots  of  status,  such  as  user  operation  and  application  status,  then  issue  Vehicle
Info  Control  or  Resource  Control  to  provide  information.  Policy  Manager  controls  two  types  of
resource,  one  is  called  “GUI  resources”  such  as  screen  and  sound,  and  other  one  is  called
Page  27  of  159
![](media/picture121.jpeg)![](media/picture122.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
“System  resources”  such  as  CPU  and  memory.
4.1.3.1.2  GUI  Resources
(1)  Definition
·  About  Control  of  GUI  Resources
AGL  is  supposed  the  following  devices  in  this  feature.  For  example,  display  with  touch  panel,
speaker,  and  microphone.  And  AGL  defines  that  “GUI  resources”  are  resources  that  provide  user
or  is  provided  by  user  on  those  devices,  such  as  windows,  sound  streams  and  input  events.
**Figure  7-1:  GUI  resources**
Page  28  of  159
![](media/picture123.jpeg)![](media/picture124.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Policy  Manager  controls  GUI  resources  according  to  external  conditions.  For  example,  Policy
Manager  limits  the  information  of  GUI  resources  while  the  vehicle  is  driving,  because,  the  too
much  information  distracts  the  attention  of  driver  from  driving  operations.
·  Associated  Software  Architecture
The  software  architecture  of  Policy  Manager  and  related  components  regarding  GUI  resources
control  is  as  below.
**Figure  7-2:  Associated  Software  Expected  Use  Case**
Page  29  of  159

  -----------------------------------------------------------------------------------------------------------------------------------------------------
  | **No**   | **Component**          | **Description**
  |                                   
  | **.**                             
  ---------- ------------------------ --------------------------------------------------------- -------------------------------------------------------
  | 1        | Homescreen             | Request  to  control  of  GUI  resources.

  | 2        | Applications           | Request  to  output  or  input  of  GUI  resources.

  | 3        | UI  Component          | Receive  driving  mode  and  day  night  mode.  And
                                      |
                                      | then  provide  the  corresponding  feature  to
                                      |
                                      | applications  UI  such  as  input  limitation  and
                                      |
                                      | changing  the  theme.

  | 4        | Application  Manager   | Detect  application  installation.  Then  Notify  the
                                      |
                                      | definition  of  GUI  resources  such  as  role  by
                                      |
                                      | application  configurations.

  | 5-       | Vehicle                | Window  Manager
  |          |                        
  | 1        | Info                   
             |                        
             | Control                

  | 5-                                | Sound  Manager
  |                                   
  | 2                                 

  | 5-                                | Input  Manager
  |                                   
  | 3                                 

  | 5-                                | Vehicle  Info  Distributor
  |                                   
  | 4                                 

  | 5-                                | User  Manager
  |                                   
  | 5                                 
  -----------------------------------------------------------------------------------------------------------------------------------------------------

![](media/picture125.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Policy  Manager  is  related  with  the  below  components.
(2)  Role
Page  30  of  159

  -----------------------------------------------------------------------------------------------------
  | **ID**   | **Role**                     | **Description**
  ---------- ------------------------------ -----------------------------------------------------------
  | 1        | External  condition          | (1)  Receives  the  external  conditions.
             |                              
             | collection                   

  | 2        | Judgment  of  priority  of   | (1)  Receives  the  input/output/control  request  of
             |                              |
             | GUI  resource                | GUI  resources.
                                            |
                                            | (2)  Judgment  the  GUI  resource  owner  according  to
                                            |
                                            | external  conditions.

  | 3        | GUI  resource  control       | (1)  Issue  the  GUI  resource  control  according  to
                                            |
                                            | judgment.
                                            |
                                            | (2)  Notify  the  driving  mode  and  day  night  mode
                                            |
                                            | that  is  calculated  by  external  conditions.
  -----------------------------------------------------------------------------------------------------

![](media/picture126.jpeg)![](media/picture127.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Policy  Manager  has  the  below  role.
Page  31  of  159
![](media/picture128.jpeg)![](media/picture129.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
**Figure  7-3:  Definition  of  Role**
GUI  resource  classifies  screen  resource,  sound  resource  and  input  resource.  Details  of  each
resource  type  are  as  follows:
a.  Screen  Resource
a-1.  External  Condition  Collection
Policy  Manager  collects  the  below  definition  that  is  related  with  screen  resource.
**Figure  7-4:  Definition  of  screen  resource**
•  Concept  of  Display,  Layer,  Layout  and  Area
AGL  supports  not  only  one  physical  display  but  also  two  or  more  displays.  Each  display  has  one
or  more  layer.  And  each  layer  must  be  connected  to  one  layout  defined  by  Homescreen.  Layout
Page  32  of  159
![](media/picture130.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
consists  of  one  or  more  areas.  “Area”  is  graphics  composed  area  to  display  specific  graphics
window.
The  z-order  of  layers  is  flexible.  Policy  Manager  decides  the  z-order  of  each  layer  depending  on
objectives  of  them.  For  example,  layer-1  was  used  as  “phone  call  notification”,  and  layer-2  was
used  as  displaying  “map”,  then  Policy  Manager  will  decide  that  layer-1  should  be  upper  than
layer-2.
Layer  is  created  by  application  including  Homescreen.  When  application  creates  layer,
application  specifies  layer  type.  Layer  type  is  roughly  categorized  as  “Basic”  and  “Interrupt”.
“Basic”  layers  are  used  to  display  application  itself  such  as  media  playback,  map  drawing  and
setting  menu.  “Interrupt”  layers  are  used  to  display  overlay  windows  such  as  information  alert
and  enlarged  view.
When  application  creates  layer  with  ”Basic”  type,  application  must  specify  layout  type  for  it.  On
the  other  hand,  the  case  layer  with  “Interrupt”,  application  must  specify  corresponding  “Basic”
layer.  The  layout  of  “Interrupt”  layer  is  followed  by  “Basic”  layer’s  layout.
From  the  capability  of  Policy  Manager  point  of  view,  the  main  purpose  of  layer  is  to  decide  z-
order.  In  other  words,  if  there  is  a  scenario  to  change  z-order  of  two  or  more  windows  triggered
by  system  status  change  and/or  user  operation,  then  such  kind  of  window  must  assign  to
individual  layer.
•  Concept  of  Layer  Owner,  Role  and  Surface
“Layer  owner”  is  application  which  created  that  layer.  “Layer  owner”  can  request  each  area  of
that  layer.  When  “Layer  owner”  requests  specific  area,  “Layer  owner”  also  specify  “Role”  of
area.  “Role”  represents  how  to  be  used  that  area,  and  used  to  define  z-order  of  layers  by  Policy
Manager.
“Layer  owner”  also  can  request  to  change  “Role”  for  specific  area,  however,  whether  “Role”
change  is  acceptable  or  not  is  decided  by  Policy  Manager  by  using  policy  rule.
One  area  should  connect  to  one  graphics  window.  AGL  defines  the  term  “Surface”  as  graphics
window  to  display  into  one  area.
Page  33  of  159
![](media/picture131.jpeg)![](media/picture132.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Surface  is  a  canvas  to  draw  graphical  image  by  application.  To  show  via  physical  display,  surface
drawn  by  application  must  be  assigned  to  specific  area.  Figure  7-16  describes  simplest  example
to  assign  one  surface  to  full  screen  with  one  layer.  If  layer  has  two  or  more  areas,  then
corresponding  surfaces  are  mapped  to  each  area.  According  to  example  of  Figure  7-16,  surface
is  fit  to  area  size  as  “squeeze”,  however  AGL  also  provide  a  way  to  fit  as  “letterbox”  and  “pan  &
scan”.
**Figure  7-5:  Definition  of  Surface**
•  Subdivision  of  “Interrupt”  Layer
Basically,  “Basic”  layer  corresponding  to  “Interrupt”  layer  is  used  to  display  application’s  main
surface.  However  there  are  some  exceptions.  For  example  virtual  keyboard  is  not  needed  main
surface.  However,  to  follow  this  layer  type  rule,  virtual  keyboard  must  have  corresponding
“Basic”  layer.  But  this  “Basic”  layer  never  used  to  display.  Also  on-screen,  such  as  alert  message
is  not  needed  main  surface  too.  But  it  must  have  corresponding  “Basic”  layer  from  same  reason.
According  to  above  concept  and  some  exceptions,  AGL  defines  four  layer  types  described
as  Table  7-3.
Page  34  of  159

  ---------------------------------------------------------------------------------------------------------
  | **No**   | **Type**    | **Summary**                                            | **Example**
  ---------- ------------- -------------------------------------------------------- -----------------------
  | 1        | Basic       | This  is  application’s  basic  screen.  Typically,    | Map  of  navigation
                           |                                                        
                           | application  requests  this  layer  at  first  time.   

  | 2        | Interrupt   | This  is  application’s  popup  screen.                | Enlarged  view  of
                                                                                    |
                                                                                    | navigation

  | 3        | On-screen   | This  is  system  popup  screen.  Typically,  On-      | Warning  message
                           |                                                        |
                           | screen  service  (e.g.  Homescreen)  requests          | popup
                           |                                                        
                           | this  layer.                                           

  | 4        | Software    | This  is  the  software  keyboard  screen.             | Software  keyboard
             |             |                                                        
             | keyboard    | Typically,  software  keyboard  service                
                           |                                                        
                           | requests  this  layer.                                 
  ---------------------------------------------------------------------------------------------------------

  ------------------------------------------------------------------------------------------------------
  | **No**   | **Contents**   | **Summary**                                           | **Example**
  ---------- ---------------- ------------------------------------------------------- ------------------
  | 1        | Role           | This  is  screen  owner  (such  as  application  or   | Navigation
                              |                                                       
                              | service)  role.                                       

  | 2        | Sub  role      | This  is  specific  screen  role.                     | Enlarged  view
  ------------------------------------------------------------------------------------------------------

![](media/picture133.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
a-2.  Judgment  of  Priority  of  GUI  Resource
Policy  Manager  receives  the  request  with  “Role”  that  is  related  with  each  screen  resource.  Role
is  the  category  name  of  screen  resource  priority.  Role  is  used  to  judgment  of  priority  by  Policy
Manager.  Table  7-4  and  Figure  7-6  describes  the  definition  of  role  and  sub  role.
Role  consists  of  role  and  sub  role.  Role  is  screen  owner  role  such  as  “Navigation”  and  “Software
Page  35  of  159
![](media/picture134.jpeg)![](media/picture135.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
keyboard”.  Sub  role  defines  when  layer  type  of  the  screen  resource  is  not  “Basic”.  Sub  role  is
popup  screen  role  such  as  “Enlarged  view”  (of  Navigation).
**Figure  7-6:  Definition  of  Role  and  Sub  role**
The  screen  resources  are  sorted  of  priority  that  is  related  to  role  by  Policy  Manager.  If  display
has  two  or  more  layers,  then  all  layers  will  be  superimposed  by  z-order.
In  addition,  Policy  Manager  decides  the  area  of  "Interrupt"  layer  using  role.  Area  of  "Interrupt"
layer  must  be  same  area  of  the  related  "Basic"  layer.  "related"  means  that  "Role"  (is  not  "Sub
role")  of  "Basic"  and  "Interrupt"  is  same.  For  examples,  if  "Interrupt"  layer  is  set  “Navigation”
role  and  “Lane  guidance”  sub  role,  this  is  set  in  same  area  of  "Navigation"  role.
a-3.  GUI  resource  control
Policy  Manager  controls  the  screen  resources  using  Vehicle  Info  Control.  Policy  Manager  only
issues  to  control  the  screen  resources  but  it  is  actually  controlled  by  Vehicle  Info  Control
directly.
Page  36  of  159
![](media/picture136.jpeg)![](media/picture137.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
There  are  three  types  of  screen  resource  control:
One  is  allocation  of  each  surface  such  as  position,  size  and  size-fitting  method.
Second  one  is  visibility  control.  Basically,  visibility  should  be  “ON”  during  area  owner  was
assigned.  However,  visibility  may  set  to  “OFF”  during  driving  mode  due  to  driving  restriction.
Last  one  is  order  control  of  each  layer.  Policy  Manager  decides  the  order  of  each  layer,  and  issue
z-order  information  for  each  layer.
b.  Sound  Resource
b-1.  External  Condition  Collection
Policy  Manager  receives  the  below  definition  that  is  related  with  sound  resource.
**Figure  7-7:  Definition  of  Sound  Resource**
•  Zone
Zone  is  a  place  in  the  car,  such  as  driver  zone,  passenger  zone,  rear  seat  zone.  Each  zone  can
play  at  the  same  time.
Page  37  of  159

  -------------------------------------------------------------------------------------------------
  | **No**   | **Type**    | **Summary**                                  | **Example**
  ---------- ------------- ---------------------------------------------- -------------------------
  | 1        | Basic       | This  is  application’s  basic  sound.       | Music  of  media
                                                                          |
                                                                          | player

  | 2        | Interrupt   | This  is  application’s  interrupt  sound.   | Guidance  of
                                                                          |
                                                                          | Navigation

  | 3        | Beep        | This  is  beep.  Typically,  Homescreen      | Display  touch  sound
                           |                                              
                           | requests  this  type.                        
  -------------------------------------------------------------------------------------------------

![](media/picture138.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
•  Sound  type
Sound  type  is  the  category  of  sound  resource.  Sound  type  must  be  set  by  each  sound  resource
owner  such  as  application.  If  application  wants  to  play  sound,  it  must  be  assigned  to  proper
sound  type  of  proper  zone.  Only  one  sound  stream  can  occupy  specific  sound  type  of  specific
zone.  In  other  words,  if  two  or  more  sound  streams  should  be  mixed  in  same  zone,  then  each
sound  stream  must  assign  to  individual  sound  type.
AGL  supports  the  following  sound  type,  however  it’s  just  sample  and  should  be  configurable.
•  Stream
Stream  is  connection  of  sound  resource  that  is  made  in  applications.  Sound  is  transferred  in
stream.
b-2.  Judgment  of  Priority  of  GUI  resource
Policy  Manager  receives  the  request  with  “Role”  that  is  related  with  each  sound  resource.  Role
is  the  category  name  of  sound  resource.  Role  is  used  to  judgment  of  priority  by  Policy
Manager.  Figure  7-8  describes  the  definition  of  role.
Page  38  of  159
![](media/picture139.jpeg)![](media/picture140.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
**Figure  7-8:  Sample  Role**
The  sound  resources  in  the  same  zone  and  same  sound  type  are  switched  along  the  priority  that
is  related  to  role  by  Policy  Manager.  In  other  words,  the  sound  resources  of  different  zones  or
different  sound  type  are  not  switched.  They  are  mixed.
b-3.  GUI  Resource  Control
Policy  Manager  controls  the  sound  resources  using  Vehicle  Info  Control.  Policy  Manager  only
issues  to  control  the  sound  resources  but  it  is  actually  controlled  by  Vehicle  Info  Control
directly.
There  are  two  types  of  sound  resource  control:
One  is  playback  control  such  as  play,  pause  and  stop.  Policy  Manger  issues  to  play  sound  for
sound  area  owner,  and  if  area  owner  was  changed,  then  issue  to  stop  previous  playing  sound
Page  39  of  159
![](media/picture141.jpeg)![](media/picture142.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
stream  and  to  start  play  latest  area  owner.
Other  one  is  volume  control.  Two  or  more  sound  streams  of  same  zone  may  playback
simultaneously  if  each  sound  streams  are  assigned  to  different  sound  type.  In  this  case,  Policy
Manager  specifies  volume  parameter  for  each  sound  stream.  For  example,  if  route  guidance  and
music  playback  are  mixed,  assign  higher  volume  to  route  guidance  and  volume  down  for  music
playback.
c.  Input  Resource
c-1.  External  Condition  Collection
Policy  Manager  receives  the  below  definition  that  is  related  with  input  resource.
**Figure  7-9:  Definition  of  Input  Resource**
•  Device  Name
Device  name  is  identity  of  input  device  such  as  steering  SW  and  microphone.
•  Event  Type
Event  type  is  logical  group  of  input  event  from  each  input  device  such  as  volumes  and
temperatures.
c-2.  Judgment  of  Priority  of  GUI  resource
Page  40  of  159
![](media/picture143.jpeg)![](media/picture144.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
If  application  wants  to  be  notified  input  event,  it  must  request  input  event  notice  with  device
name  and  event  type.  The  request  is  judged  whether  to  notify  by  Policy  Manager  using  policy
DB.  And  Vehicle  Info  Control  notifies  input  event  to  applications  along  the  result  of  the
judgment  as  below.
**Figure  7-10:  Definition  of  routing  rule**
OEM  special  switch  means  product  variant  configuration  in  Figure  7-10.
c-3.  GUI  Resource  Control
Policy  Manager  controls  the  input  resources  using  Vehicle  Info  Control.  Policy  Manager  only
issues  to  control  the  input  resources  but  it  is  actually  controlled  by  Vehicle  Info  Control  directly.
Input  resource  control  is  to  specify  event  target  to  Vehicle  Info  Control.
4.1.3.1.3  System  Resources
(1)  Definition
Policy  Manager  controls  System  resources  according  to  external  conditions.  For  example,  Policy
Manager  limits  memory  usage  of  background  applications  when  memory  shortage  was  occurred.
Page  41  of  159

  ----------------------------------------------------------------------------------------------------
  | **ID**   | **Role**                    | **Description**
  ---------- ----------------------------- -----------------------------------------------------------
  | 1        | External  condition         | (1)  Receives  the  external  conditions.
             |                             
             | collection                  

  | 3        | System  resource  control   | 1.  Issue  the  System  resource  control  according
                                           |
                                           | to  external  condition  change.
                                           |
                                           | 2.  Kill  process(s)  forcibly  according  to  external
                                           |
                                           | condition  change.
  ----------------------------------------------------------------------------------------------------

![](media/picture145.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Policy  Manager  controls  System  resources  by  using  “Resource  Control”  of  kernel  layer.  So,
target  resources  are  CPU,  memory,  storage  bandwidth  and  network  bandwidth.
**4.1.3.2  Requirements**
4.1.3.2.1  Screen  Resource
(1)  External  Condition  Collection
System  must  provide  a  mechanism  to  receive  the  definition  that  is  used  judgment  of  resource
owner.
System  must  provide  a  mechanism  to  receive  the  physical  display  information.  Because  system
uses  physical  display  information  with  to  control  surface  to  other  system.  The  receive
information  must  include  as  follows.
a.  ID
b.  Display  resolution  (Vertical  and  horizontal  number  of  pixels)
c.  DPI
d.  Connected  ECU
Page  42  of  159
![](media/picture146.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
System  must  provide  a  mechanism  to  receive  the  layout  definition.  Layout  definition  must  be
able  to  identify  the  all  areas  of  display.  As  a  result,  system  recognizes  the  available  area  list
according  to  current  layout  of  each  display.
The  receive  definition  must  include  the  follows.
a.  ID
b.  Area  list
System  must  provide  a  mechanism  to  receive  the  area  definition.  Area  is  set  application  surface
by  system  if  the  request  is  accepted  by  system.  As  a  result,  application  surface  displays  on  the
device.
The  receive  request  must  include  the  follows.
a.  Layout  ID
b.  ID
c.  Area  position  (Coordinate  of  the  upper-left)
d.  Area  size  (Length  \*  Width)
System  must  provide  a  mechanism  to  receive  the  layout  type  of  each  display.  System  can  specify
the  available  areas  if  layout  type  is  defined.  The  receive  information  must  include  the  follows.
a.  Display  ID
b.  Layout  ID
System  must  provide  a  mechanism  to  receive  the  priority  rule.  Because  system  must  judge  the
providing  resource  using  it  when  the  request  is  collision.
The  receive  information  must  include  the  follows.
a.  Role
b.  Priority
System  must  provide  a  mechanism  to  receive  the  vehicle  status.  Because  system  must  judge
driving  mode.
The  receive  information  must  include  the  follows.
a.  Velocity
Page  43  of  159
![](media/picture147.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
b.  Brake  status
System  should  provide  a  mechanism  to  receive  the  vehicle  status.  Because  system  should  judge
day  night  mode.
The  receive  information  should  include  the  follows.
a.  The  brightness  of  the  interior
System  should  provide  a  mechanism  to  receive  the  user  status.  Because  system  should  judge  the
providing  resource  using  it.
System  should  provide  a  mechanism  to  receive  the  infrastructure  status.  Because  system  should
judge  the  providing  resource  using  it.
(2)  Judgment  of  Priority  of  GUI  Resource
System  must  provide  a  mechanism  to  assign  resource  owner  to  the  requested  resource
according  to  external  condition.  This  means  that  system  judges  the  providing  resource.
System  must  provide  a  mechanism  to  receive  the  layer  request.  System  allocates  the  physical
resource.  Application  must  request  the  area  on  this  layer  if  application  needs  to  display  the
resource.
The  receive  request  must  include  as  follows.
a.  Role
b.  Layer  type
The  receive  request  should  include  as  follows.
c.  Display  ID
System  must  provide  a  mechanism  to  receive  the  area  request.  System  sorts  layers  in  order  by
priority  that  is  related  with  the  specified  role.  Then  system  displays  the  application  surface  on
the  specified  area  on  the  specified  layer.
The  receive  request  must  include  as  follows.
a.  Role
Page  44  of  159
![](media/picture148.jpeg)![](media/picture149.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
b.  Layer  ID
The  receive  request  must  include  as  follows  when  layer  type  of  the  specified  layer  is  “Basic”.
Because  there  is  a  specification  that  the  area  on  layer  except  basic  type  must  be  located  on  the
related  basic  type  area.
c.  Area  ID
**Figure  7-11:  Sequence  to  display**
System  should  provide  an  interface  to  request  both  screen  and  sound  resource  simultaneously.
In  this  request,  requester  should  choose  below  options.
a.
Requester  needs  both  screen  and  sound.  For  example,  if  screen  resource  was  available,
but  sound  resource  was  occupied  by  other  owner  of  higher  priority,  then,  request  should
be  refused.
b.
Requester  wants  screen  and  sound  resource  as  much  as  possible.  For  example,  if  screen
resource  was  available,  but  sound  resource  was  occupied  by  other  owner  of  higher
priority,  then,  only  screen  resource  should  be  assigned  to  requester.
Page  45  of  159
![](media/picture150.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
System  should  provide  a  mechanism  to  receive  the  request  of  forcibly  acquire  and  forcibly
release.  System  should  be  able  to  forcibly  acquire  and  forcibly  release  request  during  system
running.  System  should  raise  the  requested  surface  to  the  top  of  the  display.
The  receive  request  should  include  the  follows  in  addition  to  the  information  of  the  normal
request.
a.  Effective  period  (Can  set  unlimited)
System  should  not  raise  the  other  surface  above  its  during  effective  period.
System  should  provide  a  mechanism  to  receive  the  request  that  is  specified  the  following  effect.
a.  The  effect  at  the  transition
b.  The  effect  of  display  surface
System  must  provide  a  mechanism  to  judge  priority  of  resources.  The  screen  resources  are
sorted  of  priority  that  is  related  to  role  by  system.  If  display  has  two  or  more  layers,  then  all
layers  will  be  superimposed  by  z-order.
System  must  provide  a  mechanism  to  judge  visible  surfaces  according  to  vehicle  running  state.
System  must  hide  the  surface  that  has  too  much  information.
(3)  GUI  Resource  Control
System  must  provide  a  mechanism  to  issue  the  resource  control  according  to  judgment.
System  must  provide  a  mechanism  to  issue  the  following  resource  control.
a.  Visible  /  Invisible
b.  Change  position
c.  Raise
The  receive  request  must  include  as  follows.
i.  Surface  ID  \*Only  case  of  visible.
ii.  Display  ID  \*Only  case  of  visible.
iii.  Layer  ID  \*Only  case  of  visible.
Page  46  of  159
![](media/picture151.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
iv.  Position  (Coordinate  of  the  upper-left)  \*Only  case  of  visible  and  change  position.
v.  Size  (Length  \*  Width)  \*Only  case  of  visible.
System  should  provide  a  mechanism  to  set  the  following  effect  of  the  surface  to  other  system.
a.  The  effect  at  the  transition
b.  The  effect  of  display  surface
4.1.3.2.2  Sound  Resource
(1)  External  Condition  Collection
System  must  provide  a  mechanism  to  receive  the  definition  that  is  used  judgment  of  resource
owner.
System  must  provide  a  mechanism  to  receive  the  zone  definition.  Because  system  uses  zone
information  with  to  control  stream  to  other  system.  The  receive  information  must  include  as
follows.
a.  ID
b.  Sound  device  ID
System  must  provide  a  mechanism  to  receive  the  sound  type  definition.  Because  system  uses
sound  type  information  with  to  control  stream  to  other  system.  The  receive  information  must
include  as  follows.
a.  ID
(2)  Judgment  of  Priority  of  GUI  resource
System  must  provide  a  mechanism  to  assign  resource  owner  to  the  requested  resource
according  to  external  condition.  This  means  that  system  judges  the  providing  resource.
System  must  provide  a  mechanism  to  receive  the  owner  request.  System  must  be  able  to  receive
request  during  system  running.
Page  47  of  159
![](media/picture152.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
The  receive  request  must  include  as  follows.
a.  Role
b.  Zone  ID
c.  Sound  type  ID
System  should  provide  a  mechanism  to  receive  the  request  of  forcibly  acquire  and  forcibly
release.  System  should  be  able  to  forcibly  acquire  and  forcibly  release  receive  request  during
system  running.
The  receive  request  should  include  as  follows  in  addition  to  the  information  of  the  normal
request.
a.  Effective  period  (Can  set  unlimited)
System  must  assign  resource  owner  as  requested.  And  system  must  not  assign  resource  owner
by  other  request  on  same  area  during  effective  period.
System  should  provide  a  mechanism  to  receive  the  request  that  is  specified  the  following  effect.
a.  The  effect  at  the  transition
b.  The  effect  of  output  sound
System  must  provide  a  mechanism  to  judge  priority  of  resources  when  there  are  two  or  more
resources  on  same  sound  type  on  same  zone.  System  judges  the  providing  resource  by  priority
of  resources  that  is  related  to  role.
\*  Boundary  of  the  role  between  Policy  Manager  and  application.
Page  48  of  159
![](media/picture153.jpeg)![](media/picture154.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Figure  7-12:  Boundary  of  role  (Case  of  reverse)
System  should  provide  a  mechanism  to  manage  order  of  the  owner  request.  Because  system
should  provide  a  mechanism  to  hold  the  request  until  the  request  is  approved.
For  example,  if  current  playing  interrupt  sound  completed,  select  the  next  play  interrupt  sound
from  request  history  based  on  the  priority.
(3)  GUI  Resource  Control
System  must  provide  a  mechanism  to  issue  the  resource  control  according  to  judgment.
System  must  provide  a  mechanism  to  issue  the  following  resource  control.
a.  Mute  /  Unmute
b.  Change  zone
The  receive  request  must  include  as  follows.
i.  Stream  ID
ii.  Device
In  the  case  of  multi-channel  speaker,  the  receive  request  should  include  as  follows.
iii.  Channel  ID
Page  49  of  159
![](media/picture155.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
System  should  provide  a  mechanism  to  set  the  below  effect  of  the  sound  to  other  system.
a.  The  effect  at  the  transition
b.  The  effect  of  output  sound
4.1.3.2.3  Input  Resource
(1)  External  Condition  Collection
System  must  provide  a  mechanism  to  receive  the  definition  that  is  used  judgment  of  resource
owner.
System  must  provide  a  mechanism  to  receive  the  input  device  information.  Because  system  uses
input  device  information  with  to  control  input  event  to  other  system.  The  receive  information
must  include  as  follows.
a.  ID
System  must  provide  a  mechanism  to  receive  the  event  type  definition.  Because  system  uses
input  device  definition  with  to  control  input  event  to  other  system.  The  receive  definition  must
include  as  follows.
a.  ID
b.  Related  event  IDs
(2)  Judgment  of  Priority  of  GUI  resource
System  must  provide  a  mechanism  to  assign  resource  owner  to  the  requested  resource
according  to  external  condition.  This  means  that  system  judges  the  providing  resource.
System  must  provide  a  mechanism  to  receive  the  owner  request.  System  must  be  able  to  receive
request  during  system  running.
The  receive  request  must  include  as  follows.
a.  Input  device  ID
Page  50  of  159
![](media/picture156.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
b.  Event  type  ID
System  should  provide  a  mechanism  to  judge  whether  to  accept  request  according  to  the
limitation  routing  rule  of  policy  DB.
(3)  GUI  Resource  Control
System  must  provide  a  mechanism  to  issue  the  resource  control  according  to  judgment.
System  must  provide  a  mechanism  to  issue  the  following  resource  control.
a.  Set  the  routing  rule
The  receive  request  must  include  as  follows.
i.  Input  device  ID
ii.  Event  type  ID
The  receive  request  must  include  either  as  follows.
iii.  The  allowed  application
iv.  The  denied  application
System  should  provide  a  mechanism  to  set  the  following  information.
a.  Application  that  has  active  surface
System  should  notify  the  touch  event  from  touch  panel  to  user  operating  application.  This
feature  is  needed  because  there  may  be  case  that  privilege  application  such  as  Homescreen
changes  the  active  surface.
4.1.3.2.4  System  Resources
(1)  External  Condition  Collection
System  must  provide  a  mechanism  to  collect  external  conditions  to  be  used  by  Policy  Manager
to  decide  proper  system  resource.
Page  51  of  159
![](media/picture157.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Policy  Manager  must  detect  creation  and  deletion  of  process.
To  detect  creation  of  process,  Policy  Manager  can  assign  proper  system  resource  to  created
process.
Also,  to  detect  deletion  of  process,  Policy  Manager  can  assign  resources  of  deleted  process  to
other  active  processes.
To  assign  proper  system  resource  to  specific  process,  system  must  provide  a  mechanism  to
identify  process’s  role.  In  other  words,  Policy  Manager  must  recognize  the  purpose  of  each
active  process.
Policy  Manager  must  detect  current  memory  consumption  periodically.
To  detect  current  memory  consumption,  Policy  Manager  can  control  maximum  memory  to  each
process  to  prevent  memory  shortage.  Also,  Policy  Manager  may  kill  processes  which  were
thought  as  not  so  important  process.
Policy  Manager  must  detect  current  CPU  consumption  periodically.
To  detect  current  CPU  consumption,  Policy  Manager  can  control  priority  to  each  process  to  keep
system  performance.  Also,  Policy  Manager  may  kill  processes  which  seem  to  be  in  unexpected
busy  state.
System  must  provide  a  mechanism  to  notify  application  status  change  to  Policy  Manager.
Application  status  includes  as  below.
· GUI  resource  status,  such  as  foreground  or  background.
·
Resuming  last  status  or  not.  When  system  starts  up  or  log-in  user  changes,  system  must
resume  last  status.  In  this  case,  Policy  Manager  should  assign  much  resource  to  last
application  to  resume  quickly  as  much  as  possible.
(2)  System  Resource  Control
System  must  provide  a  mechanism  to  change  assigned  system  resource  per  process  or  process
group  according  to  external  conditions.
According  to  policy  based  decision,  Policy  Manager  must  assign  proper  system  resource  to
target  process  or  process  group  by  using  “Resource  Control”  of  kernel  layer.  (typically  cgroups
Page  52  of  159
![](media/picture158.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
will  be  used)
System  must  provide  a  mechanism  to  kill  process  or  process  group  forcibly.
4.1.3.2.5  Resource  Management
Resource  Management  shall  consist  of  three  functional  components  -  Resource  Manager,  Policy
Manager,  Connection  Manager.
Resource  Management  shall  provide  CORBA  interfaces  to  rest  of  the  components  in  the  system.
Each  resource  request  shall  be  in  form  a:
AppID,
SourceID,
RequestorZoneID,
NeedAll  Flag  (to  specify  if  all  the  resources  need  to  be  allocated  ),
Required  Resource  List.
Resource  Management  shall  be  able  to  handle  resource  requests  for  Audio  Sinks  (eg:  Cabin
Speakers,  HeadPhones)
Resource  Management  shall  be  able  to  handle  resource  requests  for  Video  Sinks  (eg:  Display)
Resource  Management  shall  be  able  to  handle  Source  arbitration  (Mic,  WavPlayer  instances,
Tuners  etc.)
Resource  Management  shall  be  able  to  validate  all  the  input  parameters  for  a  resource  request
from  resource  requestors.
Resource  Management  shall  be  able  to  keep  track  of  all  the  available  resources.
Use  CCF  data  to  identify  all  the  resources  that  are  possible  in  the  system.  (static  identification)
Page  53  of  159
![](media/picture159.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Use  dynamic  registration  by  the  resource  owners  to  identify  what  resources  out  of  the  above  list
are  available  at  a  point  of  time  in  the  system.  (dynamic  identification)
Resource  Management  shall  inform  about  resource  availability  and  unavailability  in  the  system
through  status  update.
Resource  Management  shall  support  stacking/queuing  of  resource  requests.
&gt;  Receive  the  requests  from  the  resource  requestors.
&gt;  Handle  each  request  in  chronological  order  and  check  for  policy  validation  through  Policy
Manager.
&gt;  Add  the  validated  requests  into  a  priority  queue.
&gt;  Process  each  request  from  the  top  of  the  queue  for  establishing  the  connection.
&gt;  If  a  request  is  still  in  the  pending  queue  and  the  requestor  requests  to  withdraw  the  request,  it
shall  be  removed  from  the  queue.
Each  request  for  resource  shall  be  handled  as  an  independent  request  irrespective  of  any  earlier
request  by  the  same  requestor.  In  case  of  multiple  resources  requested  in  a  single  request,  it
shall  be  treated  as  a  single  request  and  will  be  processed  based  on  the  request  parameters.
If  the  NeedAll  flag  is  set  by  the  requestor,  it  shall  either  grant  all  the  requested  resources  to  the
requestor  or  none  of  them  shall  be  granted.  There  shall  be  no  partial  allocation  of  resources.
If  the  NeedAll  flag  is  not  set,  it  shall  be  able  to  do  partial  allocation  of  resources  i.e.  grant
some/all  of  the  resources  requested  by  the  requestor.
Resource  Management  shall  provide  an  interface  to  a  request  owner  to  remove/withdraw  an
existing  resource  request.
Resource  Management  shall  check  for  every  requested  resource  against  a  pre-defined  set  of
policies  if  the  request  can  be  served  at  this  point  of  time  or  not.  Below  is  a  list  of  possible  inputs
for  the  policy  decision:
&gt;  Currently  Free  or  InUse  Sink  status
&gt;  Who  is  the  resource  owner  of  the  currently  used  sink  resource  (if  it  is  in  use)
Page  54  of  159
![](media/picture160.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
&gt;  Priority  of  the  new  requestor  compared  to  the  currently  using  requestor.
Resource  Management  shall  use  the  system  state  as  an  additional  input  to  make  a  decision  if  a
request  can  currently  be  serviced  or  not.  Below  system  states  can  be  taken  as  input  to  the
policy  decision:
&gt;  Based  on  the  speed  restriction  setting  for  a  specific  region,  a  request  can  be  granted/kept
pending.
&gt;  Low  Power  Mode,  Eco  Mode,  System  errors  shall  also  be  used  to  make  policy  decisions.
At  any  point  of  time  it  shall  maintain  the  following  information  for  each  ZONE  for  use  by
resource  requestor:
&gt;  Zone  ID
&gt;  Allocated  Source  Instance
&gt;  Allocated  Sink  Instance
&gt;  Mute  status
Resource  Management  shall  not  consider  requirements  to  achieve  a  specific  feature  functionality
(e.g.  :  Lowering  audio  volume  of  rest  of  the  sinks  when  a  phone  call  is  in  progress)  as  an  input  to
the  resource  management  policy.
Resource  Management  shall  not  provide  support  for  requirements  to  achieve  a  specific  feature
functionality  (e.g.:  Pausing  a  pausable  source  when  phone  call  is  in  progress).
Resource  Management  shall  maintain  priorities  for  all  non-entertainment  sources  (eg:
AMFM\_TA,  PHONE\_NORMAL,  NAV\_VG,  etc.  shall  all  have  priorities).  In  case  two  sources  have
same  priority,  the  first  requestor  shall  be  granted  a  resource.  In  case  of  difference  in  priorities,
the  highest  priority  resource  request  shall  be  the  one  that  is  granted  the  resource.
Resource  Management  shall  maintain  same  priority  for  all  entertainment  sources  (eg:  MP,  DVD,
AMFM\_NORMAL,  etc.  shall  all  have  the  same  priority).  The  last  received  Entertainment  resource
request  will  be  the  one  that  is  granted  the  resource.
A  valid  (parameter  and  policy  validated)  resource  request  shall  never  be  denied  to  the  requestor.
It  shall  either  be  granted  or  kept  as  a  pending  request  in  the  priority  queue.
Page  55  of  159
![](media/picture161.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Resource  Management  shall  be  responsible  for  reporting  a  broken  resource  status.
It  shall  be  the  responsibility  of  the  resource  requestor  to  remove  the  request  from  Resource
Manager  if  the  resource  is  no  longer  needed.
Resource  Management  shall  assign  a  sink  instance  (the  specific  instance  allocated  out  of  all
available  instances  of  the  requested  sink  type  for  a  particular  zone)  to  a  resource  request,  once
the  request  is  granted  against  the  set  policy.
Resource  Management  shall  maintain  connection  state  of  an  already  granted  connection.
Possible  connection  states  are  Active  or  Passive.
&gt;  When  a  source  has  the  primary  (master)  control  over  a  sink,  the  connection  state  will  be
active.
Ex:  In  normal  mode,  a  driver  requesting  for  AMFM  source  to  Driver  HeadPhone  Sink  connection.
&gt;  When  a  source  has  the  secondary  (slave)  control  over  a  sink,  the  connection  state  will  be
passive.
Ex:  Driver  using  the  AMFM  source,  at  the  same  time  the  rear  passenger  requesting  for  same
AMFM  source  on  Rear  headphone  sink.
Resource  Management  shall  be  responsible  for  connecting/building  a  new  source-sink
connection  using  the  underlying  platform  support.
Resource  Management  shall  be  responsible  for  removing/releasing  an  existing  source-sink
connection  using  the  underlying  platform  support.
Resource  Management  shall  request  to  mute  the  audio  sink  before  an  existing  connection  is
removed/released.
Resource  Management  shall  provide  an  interface  to  unmute  the  audio  sink  when  a  connection  is
re-established  and  the  active  source  is  ready  to  use  the  sink  for  audio  routing.
Resource  Management  shall  provide  an  interface  to  unmute  an  audio  sink.
Page  56  of  159
![](media/picture162.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Resource  Management  shall  inform  the  resource  requestor  when  the  sink  is  connected  and  ready
to  be  used  for  audio  routing.
Resource  requestor  needs  to  inform  the  Resource  Manager  when  they  are  ready  to  start  audio
routing.  This  information  shall  be  used  to  unmute  the  allocated  sink.
Resource  Management  shall  maintain  the  system  connection  table  at  any  point  of  time.
Connection  table  contains  information  regarding  which  sink  is  currently  allocated  to  which
source  instance.
Resource  Management  shall  support  handling  of  change  in  behaviour  based  on  Limo  setting:
&gt;  Share  the  source  between  the  Rear  Seat  headphone  (Limo  mode  owner)  and  Cabin  Speakers.
System  shall  support  4  ForegroundBeep  sinks  and  2  ForegroundSpeech  sinks.  2  additional  sinks
are  reserved  for  Engine  noise  synthesis  which  is  outside  the  scope  of  this  document.  Additionally
1  FG  speech  sink  and  1  FG  beep  sink  is  reserved  for  future  use  by  ISC.
The  number  of  sinks  supported  by  the  system  shall  be  configurable  through  LCF  parameter.
Headphones  shall  not  be  required  to  support  any  foreground  sinks.
In  case  of  Foreground  sources  and  Tuner  interrupt  sources,  any  sink  that  is  taken  away  from  a
source  because  of  a  high-priority  interruption,  need  to  be  returned  back  to  the  previous  source
(if  the  request  from  the  previous  source  is  still  valid  and  it's  the  next  highest  priority  request).
As  part  of  requirement  to  improve  connection  handling  efficiency,  it  shall  have  exceptions  to  not
disconnect  the  active  connection  while  switching  between  any  Tuner  Source-Sink  Background
connection  to  another  Tuner  Interrupt  Source  with  same  sink  connection.
It  shall  inform  Resource  Manager  about  a  errors/failure  in  any  of  the  existing  sinks.
It  shall  inform  Resource  Manager  about  a  errors/failure  in  any  of  the  existing  sources.
Page  57  of  159
![](media/picture163.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
It  shall  provide  the  error  state  information  about  all  resources  to  the  Platform  Error  State
Manager.
It  shall  inform  the  resource  requestors  in  case  the  request  is  for  an  erroneous  or  faulty  sink.
It  shall  wait  for  the  application  manager  to  notify  it  to  prepare  for  shutdown.
It  shall  interact  with  the  data  storage  manager  to  access  (read  and  write)  persistence  data.
It  shall  interact  with  the  data  storage  manager  to  access  CCF  data.
It  shall  support  rules/exceptions  (Blacklist)  that  define  resource  allocation  strategy  based  on
current  system  scenario.
E.g.:  If  there  is  a  blacklist  rule  that  says  a  Speech  session  shall  not  be  allowed  while  phone  call
is  in  progress,  then  even  if  a  FG  sink  is  available,  Speech  shall  be  denied  resources  and  kept  as  a
pending  request.
It  shall  provide  an  interface  to  receive  Limo  mode  setting  status.
It  shall  provide  an  interface  to  receive  status  when  a  rear-user  selects  to  take  Cabin  control.
It  shall  use  interfaces  of  early  app  to  receive  information  if  it's  already  using  Audio/Video
resources  and  update  its  internal  status  accordingly.
On  any  change  in  input  to  the  Policy  Manager  (system  state)  it  shall  reevaluate  all  active
connections  and  reconnect  or  disconnect  if  required.
E.g.  An  Amp  gets  disconnected,  then  all  active  connects  have  to  be  disconnected.
Once  the  Amp  gets  reconnected,  the  connection  info  shall  be  reevaluated  and  final  set  of
connections  shall  be  rebuilt  with  Amp.
It  shall  provide  CORBA  interfaces  to  the  Resource  Manager.
Page  58  of  159
![](media/picture164.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
It  shall  be  responsible  for  connecting/building  a  new  source-sink  connection  using  the  underlying
platform  support.
It  shall  be  responsible  for  removing/releasing  an  existing  source-sink  connection  using  the
underlying  platform  support.
It  shall  request  to  mute  the  audio  sink  before  an  existing  connection  is  removed/released.
It  shall  provide  an  interface  to  unmute  an  audio  sink.
System  shall  support  4  ForegroundBeep  sinks  and  2  ForegroundSpeech  sinks.  2  additional  sinks
are  reserved  for  Engine  noise  synthesis  which  is  outside  the  scope  of  this  document.  Additionally
1  FG  speech  sink  and  1  FG  beep  sink  is  reserved  for  future  use  by  ISC.
The  no.  of  sinks  supported  by  the  system  shall  be  configurable  through  LCF  parameter.
It  shall  inform  Resource  Manager  about  a  errors/failure  in  any  of  the  existing  sinks.
Headphones  shall  not  be  required  to  support  any  foreground  sinks.
It  shall  wait  for  the  application  manager  to  notify  it  to  prepare  for  shutdown.
It  shall  interact  with  the  data  storage  manager  to  access  (read  and  write)  persistence  data.
It  shall  interact  with  the  data  storage  manager  to  access  CCF  data.
**4.1.4  Sound  Manager**
A  sound  manager  is  a  mechanism  in  which  a  sound  output  demand  in  two  or  more  zones  from
two  or  more  applications  is  arbitrated,  an  audio  server  manages  control  of  a  sound  output  and  a
policy  manager  manages  a  mediation  rule.
Page  59  of  159

  ----------------------------------------------------------------------------------------------------
  | **No.**   | **Role**                  | **Description**
  ----------- --------------------------- ------------------------------------------------------------
  | 1         | Routing  sound  streams   | To  route  each  sound  stream  to  proper  zone(s).

  | 2         | Mixing  level  control    | Mixing  two  or  more  sound  streams  after  volume
                                          |
                                          | control  of  each  sound  streams.

  | 3         | Sound  effect             | Provide  a  capability  of  sound  effect  as  follows,
                                          |
                                          | ·     When  changing  sound  stream.  E.g.  fade-in,
                                          |
                                          | fade-out  and  cross-fade.

  | 4         | Reduced  dependency  of   | Provide  well-defined  interface  to  reduce
              |                           |
              | hardware                  | dependency  of  hardware.  Well-defined  interface
                                          |
                                          | also  makes  it  possible  to  increase  the  effect  of
                                          |
                                          | portability  and  development  cost.
  ----------------------------------------------------------------------------------------------------

![](media/picture165.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
A  zone  is  a  place  in  the  car  divided  by  the  purpose  of  output  power  of  sound  like  a  driver  zone,  a
passenger  zone,  and  a  rear  seat  zone.  Each  zone  can  play  at  the  same  time.  Refer  to  "Sound
resource"  of  "7.1.1.2  (2)  Role"  of  "7.1  Policy  Manager"  for  the  details  of  a  zone.
Applications  that  play  and  capture  audio  via  the  audio  server,  applications  that  control  things  like
volume  and  routing  via  the  audio  server,  and  a  policy  manager  that  works  with  the  audio  server
to  implement  automatic  audio  policies.
**4.1.4.1  Use  Case**
Please  refer  “sound  resource  control”  of  Policy  Manger  section.
Table  7-14  describes  the  role  of  sound  manager  to  be  satisfied  above  purpose  and  use  cases.
**4.1.4.2  Requirements**
Page  60  of  159
![](media/picture166.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
4.1.4.2.1  Routing  Sound  Streams
System  must  provide  a  mechanism  to  manage  sound  “zone”.
Refer  to  "(2)  Sound  resource"  of  "7.3.1.2.2  Role"  of  "7.3  Policy  Manager"  for  the  details  of  a
zone  and  how  to  manage  zone.
System  must  provide  a  mechanism  to  manage  one  or  more  connected  sound  devices,  and  each
channels  of  each  sound  device.
One  or  more  sound  devices  are  usually  connected  to  a  system,  and  each  sound  device  consists
of  one  or  more  channels.  And  each  channel  outputs  the  sound  of  a  monophonic  recording.
For  example,  as  for  a  stereo  sound,  a  speaker  is  connected  to  each  of  two  channels,  and  it  is
arranged  at  the  driver  side  of  a  car,  and  the  passenger  seat  side.  If  a  telephone  call  is  got  when
outputting  stereo  music  from  both  of  speakers,  only  the  channel  of  a  driver  side  needs  to  lower
musical  volume,  and  needs  to  mix  and  output  the  sound  of  a  telephone  (to  louder  sound  than
music).  For  this  reason,  the  system  needs  to  recognize  and  control  each  channel  of  each  sound
device.
The  system  must  determine  the  route  which  outputs  two  or  more  sound  streams  to  two  or  more
zones.
Although  the  output  place  zone  of  a  sound  stream  may  change  dynamically  according  to  the
present  state  of  vehicles  and  a  policy  manager  makes  the  decision,  sound  manager  requires  the
mechanism  in  which  a  route  is  smoothly  changed  based  on  the  determination  of  policy  manager.
System  must  provide  a  mechanism  to  manage  two  or  more  sound  zone  as  grouped  zone.
System  must  provide  a  mechanism  to  do  volume  control  for  specific  zone.
All  the  sound  outputted  to  a  certain  zone  is  adjusted  by  the  volume  of  the  zone.
System  must  provide  a  mechanism  to  control  sound  stream.
Control  of  a  sound  stream  is  as  follows.
·
Mute/unmute:  System  must  provide  a  mechanism  to  do  mute  or  unmute  to  any  sound
stream.
·
Suspend/resume:  System  must  provide  a  mechanism  to  suspend  or  resume  to  any  sound
Page  61  of  159
![](media/picture167.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
stream.
Volume  control:  System  must  provide  a  mechanism  to  change  volume  to  any  sound  stream.
4.1.4.2.2  Mixing  Level  Control
The  system  must  offer  the  mechanism  for  arbitrating  two  or  more  sound  streams  outputted  to
the  same  zone  according  to  a  policy  manager's  arbitration.
System  must  provide  a  mechanism  to  do  mixing  after  volume  control  of  each  sound  streams.
System  must  provide  a  mechanism  to  attenuate  sound  volume  when  other  sound  stream
requested  to  play  into  same  sound  zone.
In  this  case,  system  must  also  provide  a  mechanism  to  return  to  the  volume  before  attenuating
the  volume  of  a  sound  stream  when  interrupted  sound  stream  was  ended.
System  must  provide  a  mechanism  to  mute  sound  volume  when  other  sound  stream  requested
to  play  into  same  sound  zone.
In  this  case,  system  must  also  provide  a  mechanism  to  unmute  sound  volume  when  interrupted
sound  stream  was  ended.
System  must  provide  a  mechanism  to  suspend  sound  stream  playback  when  other  sound  stream
requested  to  play  into  same  sound  zone.
In  this  case,  system  must  also  provide  a  mechanism  to  resume  playback  when  interrupted  sound
stream  was  ended.
4.1.4.2.3  Sound  Effect
When  sound  stream  was  changed,  system  must  provide  a  mechanism  to  do  sound  effect.
System  must  provide  typical  sound  effect  such  as  fade  in  and  fade  out.
System  must  provide  a  mechanism  to  add,  replace  and  delete  sound  effect  easily  by  using  plugin
architecture.
Page  62  of  159

  -------------------------------------------------------------------------------------------------------------------------
  | **No.**   | **Input  type**   | **Associated  device**   | **Description**
  ----------- ------------------- -------------------------- --------------------------------------------------------------
  | 1         | Key               | Steering  switch         | Simple  key  event.
                                                             |
                                                             | Deliver  to  application.

  | 2         | Keyboard          | Virtual  keyboard        | Keyboard  event.
                                                             |
                                                             | Deliver     to     application,     then     use     input
                                                             |
                                                             | method  backend  if  needed.

  | 3         | Touch             | Touch  panel             | Touch  event,  such  as  start,  stop  and  move.
                                                             |
                                                             | Also  supports  double  click  and  multi-touch
                                                             |
                                                             | capability.
                                                             |
                                                             | Deliver  to  application.

  | 4         | Sound             | Microphone               | Sound  input.
  -------------------------------------------------------------------------------------------------------------------------

![](media/picture168.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
4.1.4.2.4  Reduced  Dependency  of  Hardware
Sound  Manager  must  be  able  to  retrieve  system  structure  regarding  sound  device  and  channels
of  each  device.  And  the  system  must  enable  addition/deletion  of  a  sound  device  by  the  means
which  does  not  need  rebuild  of  systems,  such  as  a  configuration.
**4.1.5  Input  Manager**
The  Input  Manager  provides  a  capability  to  deliver  input  events  to  the  proper  application
depending  on  request  from  Policy  Manager.  Policy  Manager  will  decide  event  target  per  each
input  area.  Also,  the  IVI  system  may  use  various  car-oriented  input  devices  such  as  steering
switch.  Input  manager  provides  a  capability  to  abstract  such  kind  of  input  event.
**4.1.5.1  Use  Case**
Please  refer  “input  resource  control”  of  Policy  Manger  section.

  ---------------------------------------------------------------------------------------------------------
  | **No.**   | **Role**                  | **Description**
  ----------- --------------------------- -----------------------------------------------------------------
  | 1         | Abstract  device  event   | Provide  capability  to  abstract  from  device  event  to
                                          |
                                          | application  readable  event  name,  such  as  “volume
                                          |
                                          | up”  and  “right  arrow”.

  | 2         | Event  delivery           | Provide  capability  to  deliver  input  event  to  specified
                                          |
                                          | application.
  ---------------------------------------------------------------------------------------------------------

![](media/picture169.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Deliver  to  application  or  voice  recognition
engine.
Table  7-14  describes  the  role  of  input  manager  to  be  satisfied  above  purpose  and  use  cases.
**4.1.5.2  Requirements**
**4.1.5.3  Abstract  Device  Event**
System  must  provide  a  mechanism  to  re-configuration  regarding  input  devices  without  re-build.
Because,  connected  input  devices  may  different  by  car  grade,  car  type,  destination  and  optional
equipment.
**4.1.5.4  Event  Delivery**
System  must  provide  a  mechanism  to  deliver  any  input  event  to  any  application.
System  must  provide  an  interface  to  apply  event  delivery  rule  by  using  attribute  pair  “device  id”
and  “destination  application  id”.
Device  id  specifies  a  logical  device  name.  Logical  device  name  will  link  to  physical  device  by
UIM.2.1.2.
Page  64  of  159
![](media/picture170.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Also,  system  must  provide  a  mechanism  to  change  event  delivery  rule  dynamically.
System  must  provide  a  mechanism  to  link  between  logical  device  name  and  physical  device.
System  must  provide  a  mechanism  to  deliver  any  input  event  to  any  application  depending  on
delivery  rule  defined  in  UIM.2.1.1.
System  must  provide  a  mechanism  to  inhibit  any  event  delivery.
This  function  makes  it  possible  to  restrict  input  event  during  driving  mode.
**4.1.6  User  Manager**
**4.1.6.1  Use  Case**
**4.1.6.2  Personal  Identification**
User  manager  provides  multi-user  environment.  A  car  may  be  used  by  two  or  more  people,  and  a
person  may  use  two  or  more  cars,  by  using  rent-a-car,  for  example.
**4.1.6.3  User  Preference**
Multi-user  environment  provides  same  user  experience  for  each  user.
Also,  multi-user  aims  seamless  personal  data  sharing  not  only  between  cars  but  also  including
other  devices  such  as  smartphones  and  smart  TVs.  Furthermore,  it  will  include  seamless  data
sharing  from  your  home  and  your  office.
Identify  the  person,  and  log-in  to  the  IVI  system  as  a  specified  user.  Personal  identify  may  be
provided  by  traditional  user  name  and  password  pair,  smart  key  or  biometrics.
Once  a  user  has  logged-in  to  IVI  system,  IVI  system  should  provide  personalized  user
experience.  For  example,  Bob  uses  English,  but  Alice  uses  French.  Also,  Bob  likes  rock-music,
*but Alice likes classic-music. In this case, English and rock-music should be selected when B*ob  is
Page  65  of  159
![](media/picture171.jpeg)![](media/picture172.jpeg)![](media/picture173.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
logged-in,  and  Japanese  and  classic-music  should  be  selected  when  Alice  is  logged-in.
**Figure  7-24  :  Provide  Logged-in  User’s  UE  (User  Experience)**
**4.1.6.4  Rent-a-car  and/or  Replacing  a  Car**
When  Bob  uses  a  rent-a-car,  same  preference  should  be  adapted  as  if  he  rode  his  own  car.  If
Bob’s  preference  was  stored  in  a  cloud,  then  this  can  be  supported.  However,  security  is
important  in  this  scenario.  For  example,  Bob  must  not  be  able  to  access  to  other  user’s
preference.
**Figure  7-25  :  User  data  sharing  between  cars**
Page  66  of  159
![](media/picture174.jpeg)![](media/picture175.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
**4.1.6.5  Seamless  Data  Sharing**
Cloud-based  user  data  syncing  will  enable  seamless  data  sharing  between  IVI  systems  and
smart-phones,  home  networks  and  accessing  from  your  offices.
**Figure  7-26  :  User  data  sharing  over  the  cars**
**4.1.6.6  Role**
**Error!  Reference  source  not  found.**  describes  the  role  of  the  User  Manager  to  satisfy  the  above
purpose  and  use  cases.
**Table  7-17  :  Role  of  User  Manager**
**No.** **Role** **Description**
Page  67  of  159
![](media/picture176.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
1 User  identification
Provide  a  mechanism  to  identify  user,  such  as  user
name  and  password  pair,  smart  key  and  biometrics.
Provide  a  mechanism  to  log-in  to  the  IVI  system  as
a  specified  user.
When a different user logs in, proper user
preference  for  the  user  must  be  applied,  and
resume  last  state  of  corresponding  user.
Also,  each  application  can  store  application’s  data
per  user.  In  such  cases,  proper  user  data  must  be
applied  when  a  different  user  logs  in.
2 User  preference
Provide  a  mechanism  to  apply  user  preference  of
logged-in  user.
User  preference  includes  the  following  data.
· User  interface,  such  as  locale  and  wall-
paper.
· Resume  last  application’s  status  of  specified
user.
· Application  specific  data.
3 User  data  management
Provide  a  mechanism  to  manage  cloud  based  user
data.
The  following  capabilities  are  required.
· Download  user  data  of  the  logged-in  user
from  the  cloud.
· Update  cloud  data  if  the  user  data  was
updated  by  user  operation  or  otherwise.
· Periodically  sync-up  w/  cloud  because  user
data  may  be  updated  by  other  devices.
In  addition  to  the  above  basic  capabilities,  user  data
cache  is  essential  for  a  car,  since  a  car  may  not
always  have  a  reliable  network  connection.
4 Security Because  cloud  based  sharing  user  data  may  be
accessed  from  any  place,  user  data  must  be
protected  from  unexpected  data  access.
Page  68  of  159
![](media/picture177.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
So,  IVI  system  must  provide  security  mechanism
regarding  accessing  to  cloud  based  user  data.
**4.1.6.7  Requirements**
4.1.6.7.1  User  Identification
System  must  provide  a  mechanism  to  identify  logged-in  user.
System  must  provide  a  mechanism  to  enter  user  name  and  password,  and  verify  password  to
identify  logged-in  user.
System  should  provide  a  mechanism  to  read  smart  key  attribute  to  identify  logged-in  user.  For
example,  using  NFC.
System  should  provide  a  mechanism  to  identify  logged-in  user  by  using  biometrics.
4.1.6.7.2  User  Preference
When  a  logged-in  user  is  identified,  system  must  apply  user  preference  depending  on  the
currently  logged-in  user.
System  must  provide  a  mechanism  to  apply  personalized  user  experience  as  follows.
- Locale  settings
- UX  theme
Wall  paper
System  must  provide  an  easy  mechanism  to  add  plugin  function  and/or  attribute  of  personalized
user  experience.
Page  69  of  159
![](media/picture178.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
System  must  provide  a  mechanism  to  switch  application  data  per  user,  and  apply  logged-in
user’s  application  data  automatically.
When  user  is  identified  and  logged-in,  the  system  must  apply  last  status  of  logged-in  user.  Last
status  refers  to  the  status  of  the  system  as  the  current  logged-in  user  has  last  logged-out  of  the
system.  Specifically,  last  status  includes  the  following.
- Foreground  applications.  That  means  displayed  applications.
Background  applications.
When  user  logs  in  for  the  first  time,  the  system  must  apply  user  preference  for  new  log-in  user.
System  must  provide  a  mechanism  to  apply  default  preference  attributes  for  new  log-in  user.
System  must  provide  default  preference  attributes  and  HMI  to  apply  for  first  time  log-in  user.
4.1.6.7.3  User  Data  Management
System  must  provide  a  mechanism  to  manage  user  data.
AGL  defines  “user  data”  as  a  general  term  which  includes  all  the  data  necessary  to  realize  user
preference.
User  data  shall  be  stored  in  the  cloud.  The  cloud  provides  user  data  not  only  to  IVI  systems  but
also  other  systems  and/or  devices  such  as  smartphones,  Home-PCs,  business-PCs,  HEMS  and
home  electronics.
System  must  provide  a  mechanism  to  apply  user  preference  and  to  supply  user  data  to
application  by  using  cloud  based  user  data.
System  must  provide  a  mechanism  to  download  cloud  based  user  data  and  apply  it  as  user  data
of  the  IVI  system.
When  user  data  is  updated  in  the  IVI  system,  then  the  system  must  upload  updated  user  data  to
the  cloud.
Also,  since  other  device  or  system  may  update  shared  user  data  elsewhere,  system  must  provide
Page  70  of  159
![](media/picture179.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
a  mechanism  to  sync  with  the  cloud  periodically  to  keep  user  data  in  the  IVI  system  up-to-date.
Because  the  IVI  system  is  not  necessarily  connected  to  a  network,  the  system  must  provide  a
mechanism  to  cache  downloaded  user  data.
If  the  IVI  system  re-connected  to  a  network,  system  must  sync  with  the  cloud  as  soon  as
possible.
4.1.6.7.4  Security
Because  user  data  may  include  personal  information,  system  must  provide  a  mechanism  to
protect  user  data  from  risks  including  but  not  limited  to  leakage,  tampering  and  theft.
System  must  provide  a  mechanism  to  protect  user  data  when  accessing  to  the  cloud.
-
System  must  authenticate  communication  entity.  In  other  words,  IVI  system  must
authenticate  cloud  server,  and  cloud  server  must  authenticate  client  such  as  IVI  system,
smartphone  or  PC.
-
System  must  provide  a  mechanism  to  encrypt  transported  data  via  a  network.
-
System  must  provide  a  mechanism  to  transport  data  via  a  network  with  protection
against  falsification  of  data  from  unauthorized  access  or  illegal  access.
-
Cloud  server  must  provide  a  mechanism  to  authenticate  individual  user,  and  provide
user  data  only  to  the  authorized  user.
Because,  two  or  more  user’s  user  data  may  be  stored  in  IVI  system  as  a  cache,  system  must
provide  a  mechanism  to  protect  cache  data  from  other  users.  The  protection  of  cached  data  to
include  not  only  the  current  multi-user  environment  risk,  but  also  the  risk  of  attacks  against
cached  data.  In  other  words,  only  logged-in  user’s  cache  data  can  be  accessed.
4.2  Web  HMI
Web  based  HMI.  Contains  applications,  web  runtime  environment,  and  web-based  home  screen.
**4.2.1  Web  API**
Page  71  of  159
![](media/picture180.jpeg)![](media/picture181.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
It  is  discussed  that  HMI  parts  of  IVI  system  will  be  developed  using  HTML5.  APIs  to  use  service
function  in  IVI  system  from  web  applications  is  needed.  Audio  Visual  API  provides  APIs  for  audio
visual  equipment  control  to  web  applications.  (e.g.  Media  files  on  storage,  CD,  DVD,  BT-Audio,
Photo,  etc.)
Web  applications  use  Audio  Visual  API  to  play  audio  visual  contents  on  IVI  system.  Use  case  of
Audio  Visual  API  is  shown  in  Figure  6-1.
**Figure  6-1:  Use  case  of  Audio  Visual  API**
**4.2.1.1  Requirements**
Audio  Visual  API  must  provide  API  to  select  Audio  Visual  contents.
· Select  content  using  URL
·
Select  content  using  contents  list  provided  by  multimedia  subsystem
Page  72  of  159
![](media/picture182.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
Audio  Visual  API  must  provide  API  to  playback  Audio  Visual  contents.  (Media  file  on  storage,  CD,
DVD,  BT-Audio,  Photo,  etc.)
· Play
· Pause
· Fast-forward
· Rewind
· Track  up
· Track  down
· Select  playmode  (Repeat/Random)
Audio  Visual  API  must  provide  API  to  control  a  volume.
· Volume  up
· Volume  down
· Mute
Audio  Visual  API  must  provide  API  for  metadata  access  about  Audio  Visual  contents.
Audio  Visual  API  must  provide  API  for  notifications.
· The  case  that  playback  state  is  changed
· The  case  that  Audio  Visual  contents  is  add  /  removed
Audio  Visual  API  must  provide  API  to  play  AM/FM  radio.
· Change  the  frequency.
· Change  the  broadcasting  stations.
· Receive  the  list  of  broadcasting  stations.
· Select  the  preset  channel.
· Get  the  information  of  the  broadcasting  station.
Audio  Visual  API  must  provide  API  to  play  digital  radio.
· Store  the  broadcast  program  information.
Page  73  of  159
![](media/picture183.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
· Get  the  broadcast  program  information.
· Get  the  play  time.
· Play  the  radio  broadcast  cached.
AGL  System  must  support  a  web  API  to  access  Vehicle  information.
AGL  System  must  support  web  API  to  control  STT/TTS  daemon.
AGL  System  must  support  web  API  to  control  navi  engine.
AGL  System  needs  to  provide  a  Web  API  to  allow  peer  to  peer  communication  between  two  web
apps.
AGL  System  needs  to  provide  an  API  to  allow  peer  to  peer  communication  between  a  web  app
and  a  native  app.
AGL  System  must  support  access  control  over  app  to  app  communications.  Service  provider
should  be  able  to  restrict  subscriber.
AGL  System  must  support  W3C/HTML5  DOM,  Forms  and  Styles.
AGL  System  must  support  W3C/HTML5  Device  APIs:  Touch  Events,  Device  Orientation,
Network  Information
AGL  System  must  support  W3C/HTML5  Graphics  APIs:  canvas,  canvas  2D  context,  and  SVG
AGL  System  must  support  W3C/HTML5  Media:  audio  and  video  tags,  user  media  and  web  audio
AGL  System  must  support  W3C/HTML5  Communication  APIs:  websocket,  web  messaging,
server  sent  events,  session  history  of  browsing  context
*AGL System must support W3C/HTML5 Storage APIs: Web storage, File, Database, Web S*QL
Page  74  of  159
![](media/picture184.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
AGL  System  must  support  W3C/HTML5  Security  APIs:  Cross-Origin  Resource  Sharing,  HTML5
The  iframe  element,  Content  Security  Policy  1.0.
AGL  System  must  support  W3C/HTML5  UI  APIs:  Clipboard,  DnD,  Web  Notifications
AGL  System  must  support  W3C/HTML5  Performance  APIs:  Web  workers,  Page  Visibility,  Timing
control,  Navigation  timing
AGL  System  must  support  W3C/HTML5  Location  API:  Geolocation
AGL  System  must  support  W3C/HTML5  Widget:  Widget  Packaging  and  XML  Configuration,
Widget  Interface,  XML  Digital  Signatures  for  Widgets,  Widget  Access  Request  Policy
AGL  System  must  support  Khronos  WebGL  API.
**4.2.2  Web  Runtime**
The  Web  Runtime  module  contains  the  bindings  for  the  Web  Application  Framework  to  access
the  AGL  Application  Framework  and  Services.
**4.2.2.1  Requirements**
AGL  system  Web  Runtime  shall  provide  full  web  application  lifecycle  management  (e.g.,
installation/removal).
AGL  System  Web  Runtime  shall  provide  full  execution  environment  for  web  apps  (i.e.,  launch,
view  generation,  rendering,  etc.)
AGL  system  Web  Runtime  shall  provide  a  mechanism  to  implement  plugins/extensions  to  add
better  device/platform  integration.
Page  75  of  159
![](media/picture185.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
AGL  system  Web  Runtime  shall  provide  a  mechanism  to  manage  apps'  access  control  and  also  to
categorize  apps  with  different  privileges.
System  must  provide  high  level  GUI  components  for  Web  application.
At  least,  below  components  are  required.
· Text  labels
· Button
· Radio  button
· Check  box
· Tab  panel
· Animation  (e.g.  MNG,  GIF  animation)
· Slider
· Accordion  list
· Anchor
· Text  input  form
· Dropdown  list  box
· Date  picker
4.3  Native  HMI
The  Native  HMI  provides  an  application  framework  for  those  applications  that  are  not  written
using  Javascript  or  other  web  technologies.
**4.3.1  Native  App  Runtime**
The  Native  Runtime  module  contains  the  bindings  for  the  Native  Application  Framework  to
access  the  AGL  Application  Framework  and  Services.
**4.3.1.1  Requirements**
System  must  provide  high  level  GUI  components  for  native  application.
Page  76  of  159
![](media/picture186.jpeg)Automotive Grade Linux Requirements Spec v1.0
May  28,  2015
At  least,  below  components  are  required.
· Text  labels
· Button
· Radio  button
· Check  box
· Tab  panel
· Animation  (e.g.  MNG,  GIF  animation)
· Slider
· Accordion  list
· Anchor
· Text  input  form
· Dropdown  list  box
· Date  picker
**4.3.2  Native  Application  Framework**
The  platform  can  support  multiple  application  frameworks  any  of  which  may  be  built  into  an
SDK  or  product  build.  The  application  framework  contains  any  code  specifically  written  for  that
framework  as  well  the  bindings  to  the  Services  and  Operating  Systems  layers  that  the
application  framework  provides  for  its  applications.
