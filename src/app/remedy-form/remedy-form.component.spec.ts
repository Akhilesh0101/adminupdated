import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemedyFormComponent } from './remedy-form.component';

describe('RemedyFormComponent', () => {
  let component: RemedyFormComponent;
  let fixture: ComponentFixture<RemedyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemedyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemedyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
