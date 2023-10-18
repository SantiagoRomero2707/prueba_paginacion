import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ActividadRiesgos } from 'src/app/interfaces/acitividad-riesgos';
import { DataServiceService } from 'src/services/data-service.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})

export class TypeaheadComponent implements OnInit, AfterViewInit {

  @ViewChildren('ionRadio') ionRadios!: QueryList<ElementRef>;

  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() selectionCancel = new EventEmitter<void>();
  
  @Input() items: ActividadRiesgos[] = [];
  @Input() selectedItems: string[] = [];
  @Input() title = 'Select Items';
  

  valoresSeleccionadoTrabajo: string[] = [];
  filteredItems: ActividadRiesgos[] = [];

  itemSeleccionado: ActividadRiesgos = {code: '',label: '',showButton: false};
  itemSeleccionadoTemporal: ActividadRiesgos = {code: '',label: '',showButton: false};
  
  defaultActividad: string | null = null;  
  
  radioSelected!: string;
  constructor( private router: Router, private dataService: DataServiceService) {
    this.radioSelected = ''; // Inicializa radioSelected en un valor vacío al inicio.
  }

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.valoresSeleccionadoTrabajo = [...this.selectedItems];
  }
  
  public showBubbleButton(item: ActividadRiesgos) {
    const currentSelection = this.dataService.getRadioSelected();
    if (currentSelection === item.code) {
      // El ion-radio ya está seleccionado, deselecciónalo
      console.log('Deseleccionar')
      this.dataService.setRadioSelected('');
      this.valoresSeleccionadoTrabajo = [];
      this.dataService.setActividadTemporal({ code: '', label: '', showButton: false });
    } else {
      // El ion-radio no está seleccionado, selecciónalo
      this.radioSelected = item.code;
      this.valoresSeleccionadoTrabajo = [item.code];
      this.dataService.setRadioSelected(item.code);
      this.dataService.setActividadTemporal(item);
    }
  }

  public confirmChanges() {
    this.dataService.getObtenerActividadTemporal$.forEach((itemTemporal) => {
      console.log(itemTemporal);
      if (itemTemporal.code === '') {
        // Si itemTemporal está vacío, restablecer this.itemSeleccionado a un objeto vacío.
        this.itemSeleccionado = { code: '', label: '', showButton: false };
      } else {
        this.itemSeleccionado.code = itemTemporal.code;
        this.itemSeleccionado.label = itemTemporal.label;
        this.itemSeleccionado.showButton = itemTemporal.showButton;
      }
    });
    this.dataService.setdarActividad(this.itemSeleccionado);
    this.selectionChange.emit(this.valoresSeleccionadoTrabajo);
  }

  public trackItems(index: number, item: ActividadRiesgos): string {
    return item.code;
  }
  
  public ngAfterViewInit() {
    this.dataService.getobtenerActividad$.pipe(
      take(1)
    ).subscribe((item) => {
      console.log(item);
      this.defaultActividad = item.code;
      this.goToSection();
    });
  }
  
  public searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }

  public toggleDetail(item: any) {
    item.showButton = !item.showButton;
  }
  
  public navigateToAnotherComponent(item: ActividadRiesgos) {
    this.selectionCancel.emit();
    this.dataService.setdarActividad(item);
    this.router.navigate(['home/detalle-actividad']); // Reemplaza 'ruta-del-componente' con la ruta real.
  }

  filterList(searchQuery: string | undefined) {
    if (searchQuery === undefined) {
      this.filteredItems = [...this.items];
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item) => {
        return item.label.toLowerCase().includes(normalizedQuery);
      });
    }
  }

  public onIonInfinite(ev: Event) {
    this.generateItemsAgain();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  public generateItemsAgain() {
    const count: number = this.filteredItems.length+1;
    this.dataService.setBanderaLista(count);
    for (let i = 0; i < 50; i++) {
      this.filteredItems.push({'label':`Item ${count + i}`, 'code':`${count + i}`, 'showButton':false});  
    }
  }

  public goToSection()  {
    const code = this.defaultActividad;
    if (!code) {
      console.log('No hay datos seleccionados aún');
      return;
    }
  
    const nuevaSection = `item-${code}`;
    console.log(`Ir a la sección ${nuevaSection}`);
  
    setTimeout(() => {
      const element = document.getElementById(nuevaSection);
  
      if (element) {
        console.log('Existe un elemento y es:', element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      } else {
        console.log(`No se encontró el elemento con el ID ${nuevaSection}`);
      }
    }, 100); // Pequeño retraso de 100ms antes de intentar desplazarse
  }
  
  
}
