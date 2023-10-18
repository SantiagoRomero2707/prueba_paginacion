import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosAdminRiesgosComponent } from './datos-admin-riesgos.component';

describe('DatosAdminRiesgosComponent', () => {
  let component: DatosAdminRiesgosComponent;
  let fixture: ComponentFixture<DatosAdminRiesgosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosAdminRiesgosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosAdminRiesgosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
