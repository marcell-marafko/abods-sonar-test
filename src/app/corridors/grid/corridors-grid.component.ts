import { Component, OnInit } from '@angular/core';
import { ColDef, FilterChangedEvent, ICellRendererParams } from 'ag-grid-community';
import { RouterLinkCellRendererComponent } from '../../shared/components/ag-grid/router-link-cell/router-link-cell.component';
import {
  NoRowsOverlayComponent,
  NoRowsOverlayParams,
} from '../../shared/components/ag-grid/no-rows-overlay/no-rows-overlay.component';
import { Corridor, CorridorsService, CorridorSummary } from '../corridors.service';
import { finalize } from 'rxjs/operators';
import { ButtonCellRendererComponent } from '../../shared/components/ag-grid/button-cell/button-cell.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { asFormErrors, FormErrors } from '../../shared/gds/error-summary/error-summary.component';

const INITIAL_NO_ROWS_MESSAGE = 'No corridor data found';

@Component({
  selector: 'app-corridors-grid',
  templateUrl: 'corridors-grid.component.html',
  styleUrls: ['./corridors-grid.component.scss'],
})
export class CorridorsGridComponent implements OnInit {
  columnDefs: ColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      cellRendererFramework: RouterLinkCellRendererComponent,
      cellRendererParams: { routerLinkGetter: (params: ICellRendererParams) => [params.data.id] },
      comparator: (a, b) => a?.trim().localeCompare(b?.trim(), undefined, { numeric: true }),
      minWidth: 200,
      sort: 'asc',
      flex: 1,
      getQuickFilterText: ({ value }) => value,
      suppressNavigable: false,
      autoHeight: true,
      wrapText: true,
    },
    {
      field: 'numStops',
      headerName: 'Stops',
    },
    {
      cellRendererFramework: ButtonCellRendererComponent,
      cellRendererParams: {
        click: (params: ICellRendererParams) => () => this.confirmDeleteCorridor(params.data),
        label: 'Delete',
      },
      width: 100,
      suppressNavigable: false,
    },
  ];
  defaultColDef: ColDef = {
    sortable: true,
    unSortIcon: true,
    resizable: false,
    minWidth: 100,
    suppressNavigable: true,
    suppressMovable: true,
    getQuickFilterText: () => '',
  };
  overlayComponent = NoRowsOverlayComponent;
  overlayParams: NoRowsOverlayParams = {
    message: INITIAL_NO_ROWS_MESSAGE,
  };

  data: CorridorSummary[] = [];
  gridFilter = '';
  loading = true;
  errored = false;
  corridorForDeletion?: Corridor;
  deleteError: FormErrors[] = [];

  constructor(private corridorsService: CorridorsService, private modalService: NgxSmartModalService) {}

  ngOnInit() {
    this.corridorsService
      .fetchCorridors()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (data) => (this.data = data),
        () => (this.errored = true)
      );
  }

  filterChanged({ api }: FilterChangedEvent) {
    const rowCount = api.getDisplayedRowCount() ?? 0;
    if (this.data.length > 0 && rowCount === 0) {
      this.overlayParams.message = 'No corridors matched the search query';
      api.showNoRowsOverlay();
    } else if (rowCount > 0) {
      api.hideOverlay();
      this.overlayParams.message = INITIAL_NO_ROWS_MESSAGE;
    }
  }

  private confirmDeleteCorridor(corridor: Corridor) {
    this.corridorForDeletion = corridor;
    this.modalService.open('deleteCorridor');
  }

  deleteCorridor() {
    if (!this.corridorForDeletion) {
      return;
    }
    this.corridorsService
      .deleteCorridor(this.corridorForDeletion?.id)
      .pipe(finalize(() => this.modalService.close('deleteCorridor')))
      .subscribe(
        () => (this.data = this.data.filter((corridor) => corridor.id !== this.corridorForDeletion?.id)),
        (err) => (this.deleteError = asFormErrors(err))
      );
  }
}
