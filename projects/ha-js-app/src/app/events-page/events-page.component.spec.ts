import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsPageComponent } from './events-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { EventService } from '@it-quasar/ha-js-core';
import { Component, Input } from '@angular/core';

describe('EventsPageComponent', () => {
  let component: EventsPageComponent;
  let fixture: ComponentFixture<EventsPageComponent>;

  @Component({ selector: 'app-item', template: '' })
  class ItemComponentStubComponent {
    @Input() routerLink;
    @Input() number;
    @Input() title;
    @Input() description;
    @Input() rating;
  }

  const eventsServiceStub = {
    getEvents() {},
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [EventsPageComponent, ItemComponentStubComponent],
      providers: [{ provide: EventService, useValue: eventsServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
