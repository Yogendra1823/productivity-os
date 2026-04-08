from google_auth_oauthlib.flow import InstalledAppFlow

# The scope defines what the app is allowed to do (read and write events)
SCOPES = ['https://www.googleapis.com/auth/calendar.events']

def generate_token():
    print("Opening browser for Google Login...")
    flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
    creds = flow.run_local_server(port=0)
    
    with open('token.json', 'w') as token:
        token.write(creds.to_json())
    print("✅ Success! token.json has been generated.")

if __name__ == '__main__':
    generate_token()
