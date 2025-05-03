import os
from dotenv import load_dotenv

load_dotenv()

RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("RESET_TOKEN_EXPIRE_MINUTES", "30"))
