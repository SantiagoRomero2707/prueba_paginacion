import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosAsopagosSistemasComponent } from './datos-asopagos-sistemas.component';

describe('DatosAsopagosSistemasComponent', () => {
  let component: DatosAsopagosSistemasComponent;
  let fixture: ComponentFixture<DatosAsopagosSistemasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosAsopagosSistemasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosAsopagosSistemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
