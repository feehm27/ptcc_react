import { v4 as uuid } from 'uuid';

export default [
  {
    id: uuid(),
    name: 'Cliente',
    menus: [
      {
        id: 1,
        name: 'Dashboard',
        permissions: [
          {
            id: 1,
            name: 'Visualizar',
            is_active: true
          }
        ]
      },
      {
        id: 2,
        name: 'Contrato',
        permissions: [
          {
            id: 2,
            name: 'Alterar',
            is_active: false
          }
        ]
      }
    ]
  },
  {
    id: uuid(),
    name: 'Advogado'
  }
];
