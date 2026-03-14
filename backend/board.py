from turtle import *

for step in range(100):
    for c in ('red', 'green', 'blue'):
        color(c)
        forward(step)
        right(30)

mainloop()