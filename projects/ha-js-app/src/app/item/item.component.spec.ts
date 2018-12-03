import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComponent } from './item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show number', () => {
    const el = fixture.debugElement.query(By.css('.item__number'));
    expect(el).toBeNull();
  });

  it('should show number', () => {
    component.number = 2;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.item__number'));
    expect(el.nativeElement.textContent).toBe('#2');
  });

  it('should not show image', () => {
    const el = fixture.debugElement.query(By.css('.item__img'));
    expect(el).toBeNull();
  });

  it('should show image', () => {
    const src = 'http://exapmle.com/image.jpg';
    component.image = src;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.item__img'));
    expect(el.nativeElement.src).toBe(src);
  });

  it('title should be "Test"', () => {
    const title = 'Test';
    component.title = title;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.item__title'));
    expect(el.nativeElement.textContent).toBe(title);
  });

  it('description should be "Test"', () => {
    const description = 'Test';
    component.description = description;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.item__description'));
    expect(el.nativeElement.textContent).toBe(description);
  });

  it('rating should be 3', () => {
    component.rating = 3;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.item__rating'));
    expect(el.nativeElement.dataset.rating).toBe('3');
  });

  it('routerLink should be "/events"', () => {
    component.routerLink = 'events';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.item__link'));
    expect(el.nativeElement.getAttribute('href')).toBe('/events');
  });
});
