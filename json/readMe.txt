
Dans le fichier portfolio.json, tu peux ajouter des éléments à ton portfolio.
Ils s'afficheront automatiquement et généreront également la page de description si tu cliques dessus.

Tu as simplement à ajouter un élément comme celui-ci :

{
  "id": "portfolioModal2",                        // "portfolioModal" + "sa position dans la liste"
  "title": "Explore",                             // Le titre que tu veux lui donner 
  "category": "Graphic Design",                   // Une catégorie pour les filtres de recherche (si elle est nouvelle, elle s'ajoute automatiquement)
  "description": "Another great project.",        // La description détaillée de ton projet qui s'affiche quand tu cliques sur l'élément
  "image": "assets/img/portfolio/2.jpg",          // L'image de l'élément (c'est la même pour l'aperçu et quand tu cliques sur l'élément)
  "client": "Explore"                             // Le nom du client ou de la plateforme pour laquelle tu as travaillé sur ce projet
}                                                 // IMPORTANT : mets une virgule si un autre élément existe après, sinon, ne mets rien après l'accolade


Donc globalement, au niveau de la forme, ce sera quelque chose comme ça :

[
  {
    "..."
  },
  {
    "..."
  },
  {
    "..."
  }
]