#!/bin/bash

# Print the values directly from NX_WATCH for debugging
# echo "NX_PROJECT_NAME: $NX_PROJECT_NAME"
# echo "NX_FILE_CHANGES: $NX_FILE_CHANGES"

# Assign the environment variables
PROJECT_NAME="$NX_PROJECT_NAME"
CHANGES="$NX_FILE_CHANGES"

# Debugging: Print assigned values
# echo "PROJECT_NAME: $PROJECT_NAME"
# echo "CHANGES: $CHANGES"

# Check if PROJECT_NAME is empty
if [[ -z "$PROJECT_NAME" ]]; then
  echo "Error: PROJECT_NAME is empty. NX_PROJECT_NAME may not be set."
  exit 1
fi

COLOR_GREEN="$(tput setaf 2)"
COLOR_REST="$(tput setaf 6)"

printf '%s%s%s\n' $COLOR_GREEN "[$PROJECT_NAME] Detected change: $CHANGES" $COLOR_REST "[$PROJECT_NAME] Rebuilding..."

# Run the build command
pnpm nx run-many -t dev --projects="$PROJECT_NAME" > ./dev-mode.log 2>&1 
