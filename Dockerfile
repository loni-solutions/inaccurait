# Stage 1: Build the React app
FROM node:14 AS build-stage
WORKDIR /app
COPY ./react_app/package*.json ./
RUN npm install
COPY ./react_app .
RUN npm run build

# Stage 2: Set up the Flask app with the React build output
FROM python:3.9-slim
WORKDIR /app
COPY --from=build-stage /app/build /app/react_app/build
COPY ./flask_app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./flask_app .

# Expose the port and set the entrypoint
EXPOSE 8080
CMD ["gunicorn", "-b", ":8080", "app:app"]
