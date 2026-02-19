import os
print(os.listdir("models"))
import cv2
import numpy as np

# Load trained AI model
net = cv2.dnn.readNetFromCaffe(
    "models/deploy.prototxt",
    "models/mobilenet_iter_73000.caffemodel"
)

# Object labels model can detect
CLASSES = [
    "background", "aeroplane", "bicycle", "bird", "boat",
    "bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
    "dog", "horse", "motorbike", "person", "pottedplant",
    "toycar", "sofa", "train", "tvmonitor" , "knife" , "cellphone"
    ]

# Start camera
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if not ret:
        break

    # Get frame size
    h, w = frame.shape[:2]

    # Prepare image for AI model
    blob = cv2.dnn.blobFromImage(
        frame,
        0.007843,
        (300, 300),
        127.5
    )

    net.setInput(blob)
    detections = net.forward()

    # Loop through detected objects
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]

        if confidence > 0.5:
            class_id = int(detections[0, 0, i, 1])
            label = CLASSES[class_id]

            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (x1, y1, x2, y2) = box.astype("int")

            # Draw box
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)

            # Draw label
            cv2.putText(
                frame,
                f"{label} {confidence:.2f}",
                (x1, y1-10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0,255,0),
                2
            )

    cv2.imshow("AI Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
