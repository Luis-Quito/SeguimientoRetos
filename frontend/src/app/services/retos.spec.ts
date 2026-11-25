
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { RetosService } from './retos';

describe('RetosService', () => {
  let service: RetosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(RetosService);
  });

  it('debe crear el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });
});
