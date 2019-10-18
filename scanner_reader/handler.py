import json
import greengrasssdk

client = greengrasssdk.client('iot-data')


def hello(event, context):
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    event['touched_by'] = 'python'

    if 'go_local' in event:
        client.publish(
            topic='hello/worldnodefunc',
            payload=json.dumps(event)
        )

    client.publish(
        topic='hello/world',
        payload=json.dumps(event)
    )

    return response

    # Use this code if you don't use the http event with the LAMBDA-PROXY
    # integration
    """
    return {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "event": event
    }
    """
