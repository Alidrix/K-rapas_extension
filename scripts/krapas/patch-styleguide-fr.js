#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const target = path.resolve(
  process.cwd(),
  "vendor/passbolt-styleguide/src/locales/fr-FR/common.json"
);

if (!fs.existsSync(target)) {
  console.error(`[ERROR] Fichier introuvable: ${target}`);
  process.exit(1);
}

let src = fs.readFileSync(target, "utf8");
const original = src;

const replacements = [
  {
    from: "Si vous utilisez Passbolt sur plusieurs navigateurs ou appareils, vous devrez mettre à jour la passphrase sur chacun d’eux individuellement.",
    to: "Si vous utilisez K'rapas sur plusieurs navigateurs ou appareils, vous devrez mettre à jour la phrase de passe sur chacun d’eux individuellement."
  },
  {
    from: "Passbolt recommande un minimum de {{minimalAdvisedEntropy}} bits pour être sûr.",
    to: "K'rapas recommande un minimum de {{minimalAdvisedEntropy}} bits pour être sûr."
  },
  {
    from: "Passbolt recommande que la force de la phrase de passe soit au minimum de {{MINIMAL_ADVISED_ENTROPY}} bits pour être robuste.",
    to: "K'rapas recommande que la force de la phrase de passe soit au minimum de {{MINIMAL_ADVISED_ENTROPY}} bits pour être robuste."
  },
  {
    from: "Chaque fois que vous changez votre passphrase, Passbolt crée automatiquement une nouvelle sauvegarde de clé chiffrée avec la passphrase mise à jour.",
    to: "Chaque fois que vous changez votre phrase de passe, K'rapas crée automatiquement une nouvelle sauvegarde de clé chiffrée avec la phrase de passe mise à jour."
  },
  {
    from: "Passbolt est disponible sur l'AppStore et le PlayStore",
    to: "K'rapas est disponible sur l'AppStore et le PlayStore"
  },
  {
    from: "Passbolt est disponible dans la boutique Windows.",
    to: "K'rapas est disponible dans la boutique Windows."
  },

  // Optionnels
  {
    from: "Veuillez télécharger l'un de ces navigateurs pour commencer avec Passbolt:",
    to: "Veuillez télécharger l'un de ces navigateurs pour commencer avec K'rapas :"
  },
  {
    from: "Modifier dans passbolt",
    to: "Modifier dans K'rapas"
  },
  {
    from: "ouvrir Passbolt dans un nouvel onglet",
    to: "ouvrir K'rapas dans un nouvel onglet"
  },
  {
    from: "Félicitations ! L'extension Passbolt a été installée.",
    to: "Félicitations ! L'extension K'rapas a été installée."
  }
];

let changed = 0;

for (const entry of replacements) {
  const hasFrom = src.includes(entry.from);
  const hasTo = src.includes(entry.to);

  if (hasFrom) {
    src = src.split(entry.from).join(entry.to);
    console.log(`[PATCHED] ${entry.from} -> ${entry.to}`);
    changed += 1;
  } else if (hasTo) {
    console.log(`[OK] Déjà patché: ${entry.to}`);
  } else {
    console.log(`[INFO] Chaîne non trouvée: ${entry.from}`);
  }
}

if (src !== original) {
  fs.writeFileSync(target, src, "utf8");
  console.log(`[OK] Fichier mis à jour: ${target}`);
  console.log(`[OK] Remplacements effectués: ${changed}`);
} else {
  console.log("[OK] Aucun changement nécessaire, fichier déjà cohérent.");
}
