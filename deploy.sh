#!/bin/sh

# Deploy Cloud Function
gcloud functions deploy store_articles \
  --entry-point store_articles \
  --runtime python39 \
  --trigger-http \
  --timeout 480s \
  --region europe-west1 \
  --memory 512MB \
  --allow-unauthenticated

# Deploy App Engine
gcloud app deploy

# Deploy Scheduler
gcloud scheduler jobs create http store_articles_alltime_job \
  --schedule "0 0-11 * * *" \
  --http-method POST \
  --uri https://europe-west1-inaccurait.cloudfunctions.net/store_articles \
  --oidc-service-account-email inaccurait@appspot.gserviceaccount.com \
  --oidc-token-audience https://europe-west1-inaccurait.cloudfunctions.net/store_articles \
  --message-body '{"mode": "alltime"}' \
  --time-zone "UTC"

gcloud scheduler jobs create http store_articles_today_job \
  --schedule "0 12,20 * * *" \
  --http-method POST \
  --uri https://europe-west1-inaccurait.cloudfunctions.net/store_articles \
  --oidc-service-account-email inaccurait@appspot.gserviceaccount.com \
  --oidc-token-audience https://europe-west1-inaccurait.cloudfunctions.net/store_articles \
  --message-body '{"mode": "today"}' \
  --time-zone "UTC"