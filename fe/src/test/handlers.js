import { http, HttpResponse } from 'msw'

const suppliers = [
  {
    SupplierId: 1,
    Name: 'Supplier One',
    Address: null,
    CreatedByUser: 'test.user',
    CreatedOn: '2026-01-01',
    rates: [
      {
        SupplierRateId: 1,
        SupplierId: 1,
        Rate: 250,
        RateStartDate: '2020-01-01',
        RateEndDate: null,
        CreatedByUser: 'test.user',
        CreatedOn: '2026-01-01',
      },
    ],
  },
  {
    SupplierId: 2,
    Name: 'Supplier Two',
    Address: null,
    CreatedByUser: 'test.user',
    CreatedOn: '2026-01-01',
    rates: [
      {
        SupplierRateId: 2,
        SupplierId: 2,
        Rate: 300,
        RateStartDate: '2021-06-01',
        RateEndDate: '2024-12-31',
        CreatedByUser: 'test.user',
        CreatedOn: '2026-01-01',
      },
    ],
  },
]

export const handlers = [
  http.get('http://localhost/suppliers', () =>
    HttpResponse.json(suppliers)
  ),

  http.get('http://localhost/suppliers/:id', ({ params }) => {
    const supplier = suppliers.find((s) => s.SupplierId === Number(params.id))
    return supplier ? HttpResponse.json(supplier) : new HttpResponse(null, { status: 404 })
  }),

  http.get('http://localhost/overlaps', () =>
    HttpResponse.json(suppliers)
  ),

  http.get('http://localhost/overlaps/:id', () =>
    HttpResponse.json(suppliers)
  ),
]
