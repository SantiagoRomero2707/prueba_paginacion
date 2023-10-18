import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosBasicosAportanteComponent } from './datos-basicos-aportante.component';

describe('DatosBasicosAportanteComponent', () => {
  let component: DatosBasicosAportanteComponent;
  let fixture: ComponentFixture<DatosBasicosAportanteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosBasicosAportanteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosBasicosAportanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
