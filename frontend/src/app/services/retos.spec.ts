import { TestBed } from '@angular/core/testing';
import { Retos } from './retos';

describe('Retos', () => {
  let service: Retos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Retos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
