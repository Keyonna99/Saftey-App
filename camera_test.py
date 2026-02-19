import cv2 
cap = cv2.VideoCapture(0)  

while True:     
    Cret, frame = cap.read() 

    if not Cret:
        print("Camera not working")
        break

    cv2.imshow("Safety Camera", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
