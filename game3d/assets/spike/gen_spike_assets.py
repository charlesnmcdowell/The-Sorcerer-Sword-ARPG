import numpy as np
from PIL import Image, ImageDraw, ImageFilter
W,H=256,384
height=np.zeros((H,W),np.float32); mask=np.zeros((H,W),np.uint8)
yy,xx=np.mgrid[0:H,0:W]; cx=W/2.0
def add_capsule(h,m,x0,y0,x1,y1,r,peak):
    px,py=x1-x0,y1-y0; L2=px*px+py*py+1e-6
    t=np.clip(((xx-x0)*px+(yy-y0)*py)/L2,0,1)
    dx=xx-(x0+t*px); dy=yy-(y0+t*py); d=np.sqrt(dx*dx+dy*dy)
    inside=d<=r; bulge=np.sqrt(np.clip(1-(d/r)**2,0,1))*peak
    upd=inside&(bulge>h); h[upd]=bulge[upd]; m[inside]=1
robe_w=np.clip(38+(yy.astype(np.float32)-150)*0.30,30,120)
in_robe=(np.abs(xx-cx)<robe_w)&(yy>150)&(yy<360)
rb=np.sqrt(np.clip(1-((xx-cx)/robe_w)**2,0,1))
height[in_robe]=np.maximum(height[in_robe],rb[in_robe]); mask[in_robe]=1
add_capsule(height,mask,cx,150,cx,210,34,0.95)
add_capsule(height,mask,cx,120,cx,120,26,1.0)
add_capsule(height,mask,cx,96,cx,120,24,0.9)
add_capsule(height,mask,cx+78,90,cx+78,372,6,0.8)
hI=Image.fromarray((np.clip(height,0,1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.2))
height=np.asarray(hI,np.float32)/255.0
gy,gx=np.gradient(height*26.0); nx,ny,nz=-gx,-gy,np.ones_like(height)
ln=np.sqrt(nx*nx+ny*ny+nz*nz)+1e-6; nx,ny,nz=nx/ln,ny/ln,nz/ln
nm=np.zeros((H,W,4),np.uint8)
nm[...,0]=((nx*0.5)+0.5)*255; nm[...,1]=((ny*0.5)+0.5)*255; nm[...,2]=((nz*0.5)+0.5)*255; nm[...,3]=mask*255
Image.fromarray(nm,'RGBA').save('warlock_normal.png')
dif=Image.new('RGBA',(W,H),(0,0,0,0)); dr=ImageDraw.Draw(dif)
ROBE=(28,22,46,255);ROBE_T=(58,44,90,255);SKIN=(120,92,150,255);HAIR=(224,224,232,255);STAFF=(70,54,40,255);GEM=(120,255,200,255)
dr.polygon([(cx-32,150),(cx+32,150),(cx+118,360),(cx-118,360)],fill=ROBE)
dr.polygon([(cx-10,160),(cx+10,160),(cx+30,360),(cx-30,360)],fill=ROBE_T)
dr.line([(cx+78,92),(cx+78,372)],fill=STAFF,width=9)
dr.ellipse([cx+62,70,cx+94,102],outline=GEM,width=4); dr.ellipse([cx+70,78,cx+86,94],fill=GEM)
dr.ellipse([cx-26,96,cx+26,150],fill=ROBE); dr.ellipse([cx-20,108,cx+20,150],fill=SKIN)
dr.polygon([(cx-20,112),(cx+20,112),(cx+14,128),(cx,120),(cx-14,128)],fill=HAIR)
dr.polygon([(cx-20,112),(cx-22,140),(cx-12,140)],fill=HAIR); dr.polygon([(cx+20,112),(cx+22,140),(cx+12,140)],fill=HAIR)
dr.ellipse([cx-11,124,cx-4,130],fill=GEM); dr.ellipse([cx+4,124,cx+11,130],fill=GEM)
dif.save('warlock_diffuse.png')
sh=Image.new('RGBA',(160,70),(0,0,0,0)); ImageDraw.Draw(sh).ellipse([4,4,156,66],fill=(0,0,0,170))
sh.filter(ImageFilter.GaussianBlur(6)).save('contact_shadow.png')
g=np.zeros((128,128,4),np.uint8); gyy,gxx=np.mgrid[0:128,0:128]
d=np.sqrt((gxx-64)**2+(gyy-64)**2)/64.0; a=np.clip(1-d,0,1)**2
g[...,0]=120;g[...,1]=255;g[...,2]=200;g[...,3]=(a*255).astype(np.uint8)
Image.fromarray(g,'RGBA').save('glow.png')
print('OK assets generated')
