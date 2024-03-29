
def writepts( t,x,y,z,datacsv ) 
  pname = "dat/#{'%02.0f' %t}.csv"
  File.open( pname,"w" ) do |f|
    f.puts "X, Y, Z"
    for i in 0...x.length do
      f.puts "#{'%.2f' % x[i]}, #{'%.2f' % y[i]}, #{'%.2f' % z[i]}"
    end
  end
  datacsv.puts "#{t*10}, #{pname}"
end

def step( x,y,z,rstep )
  for i in 0...x.length do
    x[i] = x[i] + rand*rstep #* Math.cos( x[i] ) 
    y[i] = y[i] + rand*rstep #* Math.sin( y[i] )
    z[i] = z[i] + rand*rstep #* 0
  end
end

t=0
n=10
r=10
x = Array.new(n) { rand*r }
y = Array.new(n) { rand*r }
z = Array.new(n) { rand*r }
puts x.inspect

datacsv = File.open("data.csv","w")
datacsv.puts "time, FILE_points_alfa"

while t<15 do
  writepts( t,x,y,z,datacsv )
  step( x,y,z, 1 )
  t = t+1
end