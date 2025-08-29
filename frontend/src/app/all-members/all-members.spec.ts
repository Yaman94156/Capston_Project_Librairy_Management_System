import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMembers } from './all-members';

describe('AllMembers', () => {
  let component: AllMembers;
  let fixture: ComponentFixture<AllMembers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMembers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMembers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
