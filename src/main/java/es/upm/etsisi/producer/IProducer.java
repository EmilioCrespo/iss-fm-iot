package es.upm.etsisi.producer;

public interface IProducer<O> extends AutoCloseable{
	public void send(O data);
	public void send(String topic, O data);
}
