@echo off
curl -s -X POST http://localhost:8081/api/v1/auth/register -H "Content-Type: application/json" -d "{\"email\":\"jatanujverma@gmail.com\",\"password\":\"12345678\"}"
