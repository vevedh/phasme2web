import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/Empty.vue'),
    children: [
      { path: '', component: () => import('pages/Accueil.vue'), meta: { requiresAuth: true, title: 'Page d\'accueil' } },
      { path: 'actus', component: () => import('pages/Actus.vue'), meta: { requiresAuth: true, title: 'Page d\'accueil' } },
      { path: 'parking' , component: () => import('pages/AdminParking.vue'), meta: { requiresAuth: true, title: 'Page d\'accueil' }}
    ]
  },
  {
    path: '/user',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      { path: 'regvisiteurs', component: () => import('pages/Accueil_reg.vue'), meta: { requiresAuth: true, title: 'Page du profil' } },
      { path: 'profil', component: () => import('pages/Profil.vue'), meta: { requiresAuth: true, title: 'Page du profil' } },
      { path: 'parking', component: () => import('pages/DemandeParking.vue'), meta: { requiresAuth: true, title: 'Page Demande parking' } },
      { path: 'resparking', component: () => import('pages/ReservationsParking.vue'), meta: { requiresAuth: true, title: 'Page Réservations parking' } }
    ]
  },
  {
    path: '/applications',
    component: () => import('layouts/DashLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AppsPage.vue'), meta: { requiresAuth: true, title: 'Nouveau visiteur' } }
    ]
  },
  {
    path: '/formulaires',
    component: () => import('layouts/FormsLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Formulaires.vue'), meta: { requiresAuth: true, title: 'Liste des formulaires' } }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/DashLayout.vue'),
    children: [
      { path: 'main', component: () => import('pages/Dbadmin.vue'), meta: { requiresAuth: true, title: 'Administration des tables' } },
      { path: 'imprimantes', component: () => import('pages/Imprimantes.vue'), meta: { requiresAuth: true, title: 'Administration des Imprimantes' } }
    ]
  },
  {
    path: '/padusers',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AdUsersPage.vue'), meta: { requiresAuth: true, title: 'Administration des utilisateurs' } }
    ]
  },
  {
    path: '/nouveau',
    component: () => import('layouts/Empty.vue'),
    children: [
      { path: '', component: () => import('pages/visiteurs/Nouveau.vue'), meta: { requiresAuth: true, title: 'Nouveau visiteur' } }
    ]
  },
  {
    path: '/form/:id',
    component: () => import('layouts/FormLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Form.vue'), meta: { requiresAuth: true, title: 'Nouveau visiteur' }  }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Empty.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/emailbuilder/:id',
    component: () => import('layouts/LayoutEmpty.vue'),
    children: [
      { path: '', component: () => import('pages/EmailBuilder.vue'), meta: { requiresAuth: true, title: 'Createur de formulaires' } }
    ]
  },
  {
    path: '/formbuilder/:id',
    component: () => import('layouts/LayoutEmpty.vue'),
    children: [
      { path: '', component: () => import('pages/FormBuilder.vue'), meta: { requiresAuth: true, title: 'Createur de formulaires' } }
    ]
  },
  {
    path: '/donnees',
    component: () => import('layouts/Empty.vue'),
    children: [
      { path: '', component: () => import('pages/Donnees.vue'), meta: { requiresAuth: true, title: 'Données visiteur' } }
    ]
  },
  {
    path: '/flipbook',
    component: () => import('layouts/Empty.vue'),
    children: [
      { path: '', component: () => import('pages/FlipBookPage.vue'), meta: { requiresAuth: true, title: 'Document à feuilleter' } }
    ]
  },
  {
    path: '/gardien',
    component: () => import('layouts/Tablette.vue'),
    children: [
      { path: '', component: () => import('pages/ReservationsParking.vue'), meta: { requiresAuth: true, title: 'Vue reservations parking' } }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
