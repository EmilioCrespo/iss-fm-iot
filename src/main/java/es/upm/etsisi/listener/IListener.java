/*
 * #%L
 * TDManager
 * %%
 * Copyright (C) 2014 - 2016 SYST Group, Universidad Politecnica de Madrid
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
package es.upm.etsisi.listener;

import es.upm.etsisi.websockets.WsSessionHandler;

public interface IListener<I,O> extends Runnable, AutoCloseable{
	public void start();
	public void stop();
	public boolean isStarted();
	public void setHandler(WsSessionHandler handler);
}
