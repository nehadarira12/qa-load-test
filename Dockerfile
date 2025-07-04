# Use the official k6 image
FROM loadimpact/k6

# Copy the test script into the container
COPY load-test.js /load-test.js

# Run the k6 test when the container starts
ENTRYPOINT ["k6", "run", "/load-test.js"]
