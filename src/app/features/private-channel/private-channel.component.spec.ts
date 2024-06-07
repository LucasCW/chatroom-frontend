import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateChannelComponent } from './private-channel.component';

describe('PrivateChannelComponent', () => {
  let component: PrivateChannelComponent;
  let fixture: ComponentFixture<PrivateChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateChannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivateChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
