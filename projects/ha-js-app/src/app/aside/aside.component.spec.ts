import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideComponent } from './aside.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('AsideComponent', () => {
  let component: AsideComponent;
  let fixture: ComponentFixture<AsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AsideComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain routerLinks', () => {
    const links = fixture.debugElement.queryAll(By.css('.app-nav__link'));
    expect(links.length).toBe(4);
    expect(links[0].nativeElement.getAttribute('href')).toBe('/events');
    expect(links[1].nativeElement.getAttribute('href')).toBe('/speakers');
    expect(links[2].nativeElement.getAttribute('href')).toBe('/reports');
    expect(links[3].nativeElement.getAttribute('href')).toBe('/registration');
  });

  it('should logo redirect to home', () => {
    const el = fixture.debugElement.query(By.css('.logo-block'));
    expect(el.nativeElement.getAttribute('href')).toBe('/');
  });
});
