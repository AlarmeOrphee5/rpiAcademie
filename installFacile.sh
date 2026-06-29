#!/bin/bash

echo "===================================="
echo "  Installation RpiAcademie"
echo "===================================="

set -e

# -------------------------
# 1. UPDATE SYSTEM
# -------------------------
echo "[1/6] Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# -------------------------
# 2. INSTALL DEPENDANCES SYSTEM
# -------------------------
echo "[2/6] Installation dépendances système..."

sudo apt install -y git curl build-essential

# GPIO (pigpio)
sudo apt install -y pigpio python3-pigpio

# Démarrage daemon pigpio
sudo systemctl enable pigpiod || true
sudo systemctl start pigpiod || true

# -------------------------
# 3. NODEJS (si pas installé)
# -------------------------
echo "[3/6] Vérification Node.js..."

if ! command -v node &> /dev/null
then
    echo "Node.js non trouvé, installation..."

    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Node.js déjà installé"
fi

# -------------------------
# 4. CLONE PROJET
# -------------------------
echo "[4/6] Téléchargement projet GitHub..."

PROJECT_DIR="$HOME/rpiAcademie"

if [ -d "$PROJECT_DIR" ]; then
    echo "Projet déjà existant → mise à jour"
    cd "$PROJECT_DIR"
    git pull
else
    git clone https://github.com/AlarmeOrphee5/rpiAcademie.git "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# -------------------------
# 5. INSTALL NODE MODULES
# -------------------------
echo "[5/6] Installation npm..."

npm install
npm install pigpio

# -------------------------
# 6. INSTALL daemon
# -------------------------
echo "[6/6]Installation du service systemd"

cat <<EOF | sudo tee /etc/systemd/system/rpiacademie.service > /dev/null
[Unit]
Description=RpiAcademie
After=network.target

[Service]
Type=simple
WorkingDirectory=$(pwd)
ExecStart=$(which node) server.js
Restart=on-failure
User=root

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

echo "✅ Service installé."

echo ""
echo "Commandes disponibles :"
echo "  sudo systemctl start rpiacademie - Lance le serveur"
echo "  sudo systemctl stop rpiacademie - arrete le serveur"
echo "  sudo systemctl restart rpiacademie - relance le serveur"
echo "  sudo systemctl status rpiacademie - status du serveur"
# -------------------------
# 7. DONE
# -------------------------
echo ""
echo "===================================="
echo "  ✅ Installation terminée !"
echo "  👉 Interface : http://$(hostname -I | awk '{print $1}'):3000"
echo "  👉 Logs      : pm2 logs rpiAcademie"
echo "  👉 Statut    : pm2 status"
echo "===================================="