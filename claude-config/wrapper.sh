#!/bin/bash
# Fun example: Add a welcome message and validate AWS configuration

echo "🚀 Starting Claude Code on Amazon Bedrock workshop!"
echo "📍 Region: ${AWS_REGION:-us-west-2}"
echo "⏰ Session started at: $(date '+%H:%M:%S')"

# Ensure AWS region is set for the workshop
export AWS_REGION=${AWS_REGION:-us-west-2}

# Execute Claude Code with all arguments
exec "$@"