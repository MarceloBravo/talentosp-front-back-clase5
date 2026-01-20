$token = node 'C:\cursos\talentops\frontend-backend\clase 5\taskflow-app\backend\tmp\generate_jwt.js'
Write-Output "TOKEN: $token"

Write-Output "== POST create task (projectId=1) =="
try {
    $resp = Invoke-RestMethod -Uri "http://localhost:3000/api/tasks/1" -Method Post -Headers @{ Authorization = "Bearer $token" } -Body @{ title='Test Task from ps1'; description='Created by automated test'; status='pending'; priority='low'; assignee_id='1'; due_date='2026-01-20' }
    Write-Output ($resp | ConvertTo-Json -Depth 5)
} catch {
    Write-Output "POST error: $_"
}

Write-Output "== GET all tasks =="
try {
    $list = Invoke-RestMethod -Uri "http://localhost:3000/api/tasks" -Method Get
    Write-Output ($list | ConvertTo-Json -Depth 5)
} catch {
    Write-Output "GET error: $_"
}
