#!/bin/bash

echo "======================================"
echo "🔗 Port Forwarding Setup"
echo "======================================"

echo ""
echo "Les services seront accessibles sur:"
echo ""
echo "1. Frontend (Port 8080):"
echo "   kubectl port-forward -n portfolio svc/frontend 8080:80"
echo ""
echo "2. Backend (Port 3000):"
echo "   kubectl port-forward -n portfolio svc/backend 3000:3000"
echo ""
echo "3. MongoDB (Port 27017):"
echo "   kubectl port-forward -n portfolio svc/mongodb 27017:27017"
echo ""

# Démarrer les port-forwards
echo "Démarrage des port-forwards..."
echo ""

# Frontend
kubectl port-forward -n portfolio svc/frontend 8080:80 &
FE_PID=$!

# Backend
kubectl port-forward -n portfolio svc/backend 3000:3000 &
BE_PID=$!

# MongoDB
kubectl port-forward -n portfolio svc/mongodb 27017:27017 &
DB_PID=$!

echo ""
echo "✅ Port-forwards actifs!"
echo ""
echo "PIDs: Frontend=$FE_PID, Backend=$BE_PID, MongoDB=$DB_PID"
echo ""
echo "Frontend: http://localhost:8080"
echo "Backend: http://localhost:3000"
echo "MongoDB: mongodb://admin:admin123@localhost:27017/Node?authSource=admin"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"

trap "kill $FE_PID $BE_PID $DB_PID" EXIT

wait
